<script setup lang="ts">

import {onMounted, reactive, ref, watchEffect} from "vue";
import Message from "./Message.vue";
import {getMessages, sendMessageToUser} from "../../api";
import {messageStore} from "../../store";


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
    data.messages = res.data.map((msg: any) => ({
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
    if (message.receiver === messageStore().self || message.sender === messageStore().self) {
        data.messages.push({
            text: message.content,
            sender: message.sender,
            receiver: message.receiver
        })
    }
}

watchEffect(() => {
    if (messageStore().other !== data.info.other) {
        data.info.other = messageStore().other
        loadMessages()
    }
})
</script>

<template>
    <div id="interface">
        <el-card class="card">
            <template #header>
                {{ data.info.otherNickname }}
            </template>
            <el-scrollbar class="scrollbar">
                <Message :data="data"/>
            </el-scrollbar>
            <template #footer>
                <el-input v-model="send">
                    <template #append>
                        <el-button @click="sendMessage">发送</el-button>
                    </template>
                </el-input>
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
    height: calc(100% - 170px);
}

</style>