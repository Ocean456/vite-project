<script setup lang="ts">
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {sendMessageToUser} from "../../api";
import {contactStore, messageStore, userStore} from "../../store";
import {ElNotification, ElScrollbar} from "element-plus";
import ContactDetailsCard from "../contact/ContactDetailsCard.vue";
import MessageBox from "./base/MessageBox.vue";
import Emoji from "./base/extend/Emoji.vue";
import {Cloudy, Picture} from "@element-plus/icons-vue";

// websocket connection
const token = localStorage.getItem('token')
const ws = new WebSocket(`ws://localhost:1010/socket?token=${token}`)
// const ws = new WebSocket(`ws://36.212.25.142:1010/socket?token=${token}`)

ws.onopen = () => console.log('Connected to the server')

const base = ref({
    self: messageStore().self,
    other: messageStore().other,
    selfAvatar: messageStore().selfAvatar,
    otherAvatar: messageStore().otherAvatar,
    otherNickname: messageStore().otherNickname,
    type: messageStore().type
})

const data = reactive(
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

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>()

const loadMessages = async () => {
    const messages = await window.electronAPI.getMessages(messageStore().other, messageStore().type)
    const res = Object.values(JSON.parse(messages))
    data.messages = res.map((msg: any, index: number) => ({
        id: `msg-${msg.sender}-${msg.receiver}-${index}`,
        text: msg.content,
        receiver: msg.receiver,
        sender: msg.sender
    }))
}

onMounted(() => {
    loadMessages()
    init()
})


const send = ref<string>("")

const sendMessage = async () => {
    if (send.value === "" || send.value === "\n") {
        ElNotification({
            message: "消息不能为空",
            type: "error",
            duration: 2000,
            showClose: false,
            offset: 60,
        })
        send.value = ""
        return
    }
    await sendMessageToUser(userStore().username, messageStore().other, send.value).then((res) => {
        data.messages.push({
            text: send.value,
            sender: userStore().username,
            receiver: messageStore().other
        })
        send.value = ""
        const message = [res.data]
        window.electronAPI.saveMessages(message, data.info.type)

    })

    await nextTick(() => {
        const height = document.getElementById("scrollbar")!.scrollHeight
        scrollbarRef.value!.setScrollTop(height)
    })
}

const sendImage = (response: any) => {
    console.log(response)
    const message = {
        content: 'image:' + response,
        sender: userStore().username,
        receiver: messageStore().other
    }

    sendMessageToUser(userStore().username, messageStore().other, message.content).then((res) => {
        const message = JSON.stringify([res.data])
        window.electronAPI.saveMessages(message, data.info.type)
    })

    data.messages.push({
        text: message.content,
        sender: message.sender,
        receiver: message.receiver
    })
    console.log(message)
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
    const contact = contactStore().getContact(message.sender)
    const array = contactStore().contacts

    ElNotification({
        // @ts-ignore
        title: contact.contactNickname,
        message: message.content,
        duration: 2000,
        onClick: () => {
            messageStore().other = message.sender
            // @ts-ignore
            messageStore().otherNickname = array.filter((item: any) => item.contactUsername === message.sender)[0].contactNickname
        },
        showClose: false,
        offset: 60
    })
}


const loading = ref(false)

watch(() => messageStore().other, async (newOther) => {
    loading.value = true;
    data.info.other = newOther;
    data.info.otherNickname = messageStore().otherNickname;
    data.info.otherAvatar = messageStore().otherAvatar;
    await loadMessages();
    loading.value = false;

});


const init = () => {
    const div = document.getElementsByClassName("el-card__header")
    div[0].classList.add("drag")


}

const showEmojiPicker = ref(false)


</script>

<template>
    <div id="interface" style="min-width: 200px" v-loading="loading">
        <el-card class="card "  shadow="never">
            <template #header>
                <el-tooltip effect="light" trigger="click"
                            :disabled="messageStore().type === 'group' "
                >
                    <template #content>
                        <ContactDetailsCard style="padding: 20px"/>
                    </template>
                    <span class="no-drag">
                            {{ data.info.otherNickname }}
                        </span>
                </el-tooltip>
            </template>
            <el-scrollbar id="scrollbar" ref="scrollbarRef" wrap-class="scrollbar" style="height: 100%" class="no-drag">
                <MessageBox :data="data"/>
            </el-scrollbar>
            <template #footer class="input-box">
                <div class="input-menu" style="position: relative;display: flex;margin-bottom: 1px">
                    <el-button style="padding: 0 10px" link class="no-drag" @click="showEmojiPicker = !showEmojiPicker">
                        <el-icon size="20">
                            <Cloudy/>
                        </el-icon>
                    </el-button>
                    <el-upload method="post"
                               action="http://localhost:1010/api/image/upload"
                               :headers="{Authorization: 'Bearer ' + token}"
                               style="height: 20px"
                               :on-success="sendImage"
                    >
                        <el-button style="padding: 0 10px" link class="no-drag">
                            <el-icon size="20">
                                <Picture/>
                            </el-icon>
                        </el-button>
                    </el-upload>
                    <Emoji v-if="showEmojiPicker" @select-emoji="send += $event" class="no-drag"
                           style="position: absolute; bottom: 150%;"/>
                </div>
                <el-input v-model="send"
                          :rows="9"
                          type="textarea"
                          placeholder="请输入消息内容"
                          resize="none"
                          @keyup.enter="sendMessage"
                          class="no-drag"
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
    border-radius: 0 4px 4px 0;
    border-top: none;
    background-color: var(--el-bg-color);
}

:deep(.el-card__body) {
    height: calc(100% - 300px);
    padding: 0;
}

.send-button {
    position: fixed;
    right: 40px;
    bottom: 40px;
}

:deep(.el-textarea__inner) {
    background-color: var(--el-bg-color);
    box-shadow: none;
    letter-spacing: 1px;
}

:deep(.el-card__header) {
    padding: 10px 20px;
    min-height: 41.6px;
}

:deep(.el-card__footer) {
    padding: 8px 20px;
}


</style>
