<script setup lang="ts">
import {nextTick, onMounted, reactive, ref, watch} from "vue";
import {sendMessageToUser, sendMessageToGroup, deleteContact} from "../../request";
import {contactStore, messageStore, userStore} from "../../store";
import {ElNotification, ElScrollbar} from "element-plus";
import ContactDetailsCard from "../contact/ContactDetailsCard.vue";
import MessageBox from "./base/MessageBox.vue";
import Emoji from "./base/extend/Emoji.vue";
import {Cloudy, Operation, Picture} from "@element-plus/icons-vue";

// WebSocket setup
const token = localStorage.getItem('token');
const ws = new WebSocket(`ws://localhost:1010/socket?token=${token}`);

ws.onopen = () => console.log('Connected to the server');

// Reactive state
const base = ref(messageStore());
const data = reactive({
    info: base.value,
    messages: [] as Array<{ text: string; sender: string; receiver: string; }>
});

const scrollbarRef = ref<InstanceType<typeof ElScrollbar>>();
const send = ref<string>("");
const loading = ref(false);
const showEmojiPicker = ref(false);

// Load messages
const loadMessages = async () => {
    const messages = await window.electronAPI.getMessages(messageStore().other, messageStore().type);
    data.messages = Object.values(JSON.parse(messages)).map((msg: any, index: number) => ({
        id: `msg-${msg.sender}-${msg.receiver}-${index}`,
        text: msg.content,
        receiver: msg.receiver,
        sender: msg.sender
    }));

    await nextTick(() => {
        const height = document.getElementById("scrollbar")!.scrollHeight;
        scrollbarRef.value!.setScrollTop(height);
    });
};

const sendMessage = async () => {
    if (!send.value.trim()) {
        ElNotification({
            message: "消息不能为空",
            type: "error",
            duration: 2000,
            offset: 60
        });
        send.value = "";
        return;
    }

    const sendFn = messageStore().type === 'friend'
        ? sendMessageToUser
        : sendMessageToGroup;

    await sendFn(userStore().username, messageStore().other, send.value).then(res => {
        data.messages.push({
            text: send.value,
            sender: userStore().username,
            receiver: messageStore().other
        });
        send.value = "";
        window.electronAPI.saveMessages(JSON.stringify([res.data]), data.info.type);
    });

    await nextTick(() => {
        const height = document.getElementById("scrollbar")!.scrollHeight;
        scrollbarRef.value!.setScrollTop(height);
    });

    // emitter.emit('refresh')

};

const sendImage = async (response: any) => {
    const message = {
        content: 'image:' + response,
        sender: userStore().username,
        receiver: messageStore().other
    };

    const sendFn = messageStore().type === 'friend'
        ? sendMessageToUser
        : sendMessageToGroup;

    await sendFn(userStore().username, messageStore().other, message.content).then(res => {
        window.electronAPI.saveMessages(JSON.stringify([res.data]), data.info.type);
    });

    data.messages.push({
        text: message.content,
        sender: message.sender,
        receiver: message.receiver
    });


};

// WebSocket message handling
ws.onmessage = (event) => {


    const message = JSON.parse(event.data);
    if (message.receiver === messageStore().self && message.sender === messageStore().other) {
        data.messages.push({
            text: message.content,
            sender: message.sender,
            receiver: message.receiver
        });
    }


    console.log(message);
    const contact: any = contactStore().contacts.find((contact: any) => contact.username === message.sender);
    const contactNickname = contact?.nickname || "Unknown";
    ElNotification({
        title: contactNickname,
        message: message.content,
        duration: 2000,
        onClick: () => {
            messageStore().other = message.sender;
            messageStore().otherNickname = contactNickname;
        },
        offset: 60
    });


};

// Watch for changes in the current contact
watch(() => messageStore().other, async (newOther) => {
    loading.value = true;
    data.info = {
        ...data.info,
        other: newOther,
        otherNickname: messageStore().otherNickname,
        otherAvatar: messageStore().otherAvatar
    };
    await loadMessages();
    loading.value = false;
});

const drawer = ref(false)
const handleDelete = async () => {
    deleteContact(messageStore().other).then(() => {
        ElNotification({
            message: "删除成功",
            type: "success",
            duration: 2000,
            offset: 60
        });
        drawer.value = false;
    });
}


// Initialization
onMounted(() => {
    loadMessages();
    document.querySelector(".el-card__header")?.classList.add("drag");

});
</script>

<template>
    <div id="interface" style="min-width: 200px" v-loading="loading">
        <el-card class="card" shadow="never">
            <template #header>
                <div style="display: flex">
                    <el-tooltip effect="light" trigger="click" :disabled="messageStore().type === 'group'">
                        <template #content>
                            <ContactDetailsCard style="padding: 20px"/>
                        </template>
                        <span class="no-drag">{{ data.info.otherNickname }}</span>
                    </el-tooltip>
                    <div class="flex-grow"></div>
                    <div @click="drawer = true" class="menu-more no-drag">
                        <el-icon size="20">
                            <Operation/>
                        </el-icon>
                    </div>
                </div>
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
                    <el-upload method="post" action="http://localhost:1010/api/image/upload"
                               :headers="{Authorization: 'Bearer ' + token}" style="height: 20px"
                               :on-success="sendImage">
                        <el-button style="padding: 0 10px" link class="no-drag">
                            <el-icon size="20">
                                <Picture/>
                            </el-icon>
                        </el-button>
                    </el-upload>
                    <Emoji v-if="showEmojiPicker" @select-emoji="send += $event" class="no-drag"
                           style="position: absolute; bottom: 150%;"/>
                </div>
                <el-input v-model="send" :rows="9" type="textarea" placeholder="请输入消息内容" resize="none"
                          @keyup.enter="sendMessage" class="no-drag"/>
                <el-button class="send-button" @click="sendMessage" type="info">发送</el-button>
            </template>
        </el-card>
        <el-drawer v-model="drawer"
                   :show-close="false"
                   v-if="messageStore().type === 'friend'"
        >
            <el-button style="width: 100%" @click="handleDelete">删除好友</el-button>
        </el-drawer>
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

.flex-grow {
    flex: 1;
}

.menu-more {
    cursor: pointer;
    margin-top: 5px;
}
</style>
