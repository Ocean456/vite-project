<script setup lang="ts">

import {onMounted, reactive, ref, watch, watchEffect} from "vue";
import Message from "./Message.vue";
import {getMessages, sendMessageToUser} from "../../api";
import {contactStore, messageStore} from "../../store";
import {ElNotification} from "element-plus";
import InfoCard from "../contact/InfoCard.vue";

// websocket connection
const token = localStorage.getItem('token')
const ws = new WebSocket(`ws://localhost:1010/socket?token=${token}`)

ws.onopen = () => console.log('Connected to the server')

/*
interface message {
    text: string,
    sender: string,
    receiver: string
}*/

const base = ref({
    self: messageStore().self,
    other: messageStore().other,
    selfAvatar: messageStore().selfAvatar,
    otherAvatar: messageStore().otherAvatar,
    otherNickname: messageStore().otherNickname
})

/*interface contact {
    info: typeof base,
    messages: Array<message>
}*/

const data = reactive/*<contact>*/(
    {
        info: base,
        messages: [
            {
                text: "",
                sender: "",
                receiver: ""
            }
        ]
    },
)

const loadMessages = async () => {
    /*await getMessages().then((res) => {
        data.messages = res.data.map((msg: any) => ({
            text: msg.content,
            receiver: msg.receiver,
            sender: msg.sender
        }))
    })
    data.messages = data.messages.filter(message =>
        (message.receiver === messageStore().other && message.sender === messageStore().self) ||
        (message.receiver === messageStore().self && message.sender === messageStore().other)
    );*/
    const res = await getMessages()
    data.messages = res.data.map((msg: any, index: number) => ({
        id: `msg-${msg.sender}-${msg.receiver}-${index}`,
        text: msg.content,
        receiver: msg.receiver,
        sender: msg.sender
    })).filter((message: any) =>
        (message.receiver === messageStore().other && message.sender === messageStore().self) ||
        (message.receiver === messageStore().self && message.sender === messageStore().other)
    )
}

onMounted(loadMessages)

const send = ref<string>("")

const sendMessage = () => {
    if (send.value === "") {
        ElNotification.error('消息不能为空')
        return
    }
    sendMessageToUser(messageStore().self, messageStore().other, send.value).then(() => {
        data.messages.push({
            text: send.value,
            sender: messageStore().self,
            receiver: messageStore().other
        })
        send.value = ""
    })
}


ws.onmessage = (event) => {
    const message = JSON.parse(event.data)
    if (message.receiver === messageStore().self && message.sender === messageStore().other) {
        data.messages.push({
            text: message.content,
            sender: message.sender,
            receiver: message.receiver
        })
    }
    // ElNotification.info('新的消息')
    const contact = contactStore().getContact(message.sender)
    const array = contactStore().contacts

    ElNotification({
        // @ts-ignore
        title: contact.contactNickname,
        message: message.content,
        duration: 5000,
        onClick: () => {
            messageStore().other = message.sender
            // messageStore().otherAvatar = data.filter((item: any) => item.contactUsername === message.sender)[0].contactAvatar
            // @ts-ignore
            messageStore().otherNickname = array.filter((item: any) => item.contactUsername === message.sender)[0].contactNickname
            // messageStore().otherAvatar = contact.contactAvatar
            // messageStore().otherNickname = contact.contactNickname
        }
    })
}

watchEffect(() => {
    if (messageStore().other !== data.info.other) {
        data.info.other = messageStore().other
        data.info.otherNickname = messageStore().otherNickname
        loadMessages()
    }
})

watch(() => messageStore().other, (newOther) => {
    data.info.other = newOther;
    data.info.otherNickname = messageStore().otherNickname;
    data.info.otherAvatar = messageStore().otherAvatar;
    loadMessages();
});

</script>

<template>
    <div id="interface" style="min-width: 200px">
        <el-card class="card">
            <template #header>
                <el-tooltip effect="light">
                    <template #content>
                        <InfoCard/>
                    </template>
                    {{ data.info.otherNickname }}
                </el-tooltip>
            </template>
            <el-scrollbar class="scrollbar">
                <Message :data="data"/>
            </el-scrollbar>
            <template #footer>
                <el-input v-model="send"
                          :rows="12"
                          type="textarea"
                          placeholder="请输入消息内容"
                          resize="none"
                          @keyup.enter="sendMessage"
                >
                </el-input>
                <el-button class="send-button" @click="sendMessage" type="info">发送</el-button>
            </template>
        </el-card>
    </div>
</template>

<style scoped>
#interface {
    height: 100%;
}

.card {
    height: calc(100% - 1.6px);
}

:deep(.el-card__body) {
    height: calc(100% - 400px);
}

.send-button {
    position: absolute;
    right: 40px;
    bottom: 40px;
}
</style>