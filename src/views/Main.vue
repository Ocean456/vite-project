<script setup lang="ts">
import SidebarMenu from "../components/main/SidebarMenu.vue";
import {onMounted, ref, shallowRef, watch} from 'vue'
import MessageCardList from "./main/MessageCardList.vue";
import {getContacts, getSelfInfo, getMessages, getNewMessages, getGroup, getGroupMessages} from "../api";
import WindowControls from "../components/main/WindowControls.vue";
import {ElMessage} from "element-plus";
import {contactStore, groupStore, messageStore, userStore} from "../store";
import BlankPage from "../components/BlankPage.vue";
import FriendChat from "../components/chat/Chat.vue";
import router from "../router";
import ContactSearchAdd from "../components/contact/ContactSearchAdd.vue";
import Information from "../components/personal/Information.vue";

const {setContacts} = contactStore()
const {setGroups} = groupStore()

const loading = ref(false)

const asideComponent = shallowRef(MessageCardList)
const mainComponent = shallowRef(BlankPage)

interface ConfigData {
    id: number
    key: string
    value: string
}

interface UserData {
    nickname: string
    username: string
    avatar: string
    email: string
    phone: string
    area: string
}

interface MessageData {
    mid: number
    sender: string
    receiver: string
    content: string
    time: string
}

interface GroupData {
    name: string
    number: string
    description: string
    avatar: string
    memberCount: number
    ownerName: string
    ownerAvatar: string
}

const config = ref<ConfigData[]>([])


const contactData = ref<UserData[]>([])
const groupData = ref<GroupData[]>([])
const selfData = ref<UserData>()
const messageData = ref<MessageData[]>([])
const groupMessageData = ref<MessageData[]>([])

const key = ref(0)

const loadContactData = async () => {
    try {
        const res = await getContacts()
        contactData.value = res.data
        setContacts(contactData.value)
    } catch (e) {
        console.log(e)
    }
}

const loadGroupData = async () => {
    try {
        const res = await getGroup()
        groupData.value = res.data
        setGroups(groupData.value)
    } catch (e) {
        console.log(e)
    }
}

const loadSelfData = async () => {
    try {
        const res = await getSelfInfo()
        selfData.value = res.data
        if (selfData.value) {
            console.log('登录成功: ' + selfData.value.username)
            userStore().init(selfData.value.username, selfData.value.avatar)
        }
    } catch (e) {
        localStorage.removeItem('token')
        await router.push('/login')
        ElMessage.error("请重新登录")
    }
}

const loadMessageData = async () => {

    try {

        const lastSyncMid = config.value.find((item: any) => item.key === 'lastSyncMessageId')?.value || 0

        if (lastSyncMid === 0) {
            const res = await getMessages()
            messageData.value = res.data
        } else {
            const res = await getNewMessages(Number(lastSyncMid))
            messageData.value = res.data
        }

    } catch (e) {
        console.log(e)
    }
}

const loadGroupMessageData = async () => {
    try {
        const res = await getGroupMessages()
        groupMessageData.value = res.data
    } catch (e) {
        console.log(e)
    }
}

const saveData = async () => {
    const serializedData = JSON.stringify(messageData.value)
    const serializedGroupData = JSON.stringify(groupMessageData.value)
    await window.electronAPI.saveMessages(serializedData, 'default')
    await window.electronAPI.saveMessages(serializedGroupData, 'group')
}

const handleRefresh = () => {
    loading.value = true
    setTimeout(async () => {
        await window.electronAPI?.getConfig().then((res) => {
            config.value = JSON.parse(res)
        })

        await Promise.all([loadSelfData(), loadContactData(), loadMessageData(), loadGroupData(), loadGroupMessageData()]);

        await saveData()

        key.value += 1

        loading.value = false
    }, 2000)
}

const additionDialog = ref(false)
const infoDialog = ref(false)

const openAddDialog = () => {
    additionDialog.value = true
}

const openInfoDialog = () => {
    infoDialog.value = true
}


onMounted(async () => {
    window.electronAPI?.setWindow({width: 1000, height: 800})

    await window.electronAPI?.getConfig().then((res) => {
        config.value = JSON.parse(res)
    })

    await Promise.all([loadSelfData(), loadContactData(), loadMessageData(), loadGroupData(), loadGroupMessageData()]);

    await saveData()

    console.log('Electron Version: ' + window.versions.electron + ' Chrome Version: ' + window.versions.chrome + ' Node Version: ' + window.versions.node)
})

watch(() => messageStore().other, (newVal) => {
    if (newVal) {
        mainComponent.value = FriendChat
    } else {
        mainComponent.value = BlankPage
    }

})

</script>

<template>
    <div id="main">
        <el-container class="container" v-loading='loading' element-loading-text="Loading...">
            <el-container>
                <SidebarMenu @refresh="handleRefresh" @addition="openAddDialog" @info="openInfoDialog"/>
                <el-aside class="aside">
                    <component :key="key" :is="asideComponent"></component>
                </el-aside>
                <el-main class="main drag">
                    <WindowControls class="no-drag win-control"/>
                    <component class="main-component drag" :key="key" :is="mainComponent"></component>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog v-model="additionDialog" class="no-drag">
            <ContactSearchAdd/>
        </el-dialog>
        <el-dialog v-model="infoDialog" class="no-drag">
            <Information/>
        </el-dialog>
    </div>
</template>

<style scoped>
.aside {
    min-width: 180px;
    max-width: 250px;
    width: 20%;
    height: 100vh;
    overflow: hidden;
    background-color: var(--el-aside-bg-color);
}


/*.header {
    max-height: 80px;
    padding: 0;
}*/

.contact :hover {
    background-color: #f5f5f5;
}

.container {
    user-select: none;
}

.main {
    padding: 0;
    height: 100vh;
    position: relative;
    background-color: var(--el-bg-color);
    overflow: hidden;
    border-radius: 0 4px 4px 0;
}

.main-component {
    margin-top: 25px;
    height: calc(100% - 20px);
}


.win-control {
    position: absolute;
    top: 0;
    right: 0;
}


:deep(.el-dialog) {
    max-width: 430px;
    min-width: 400px;
    background-color: var(--el-bg-color-overlay);
}

:deep(.el-input-group__prepend) {
    background-color: var(--el-input-bg-color);
    padding: 8px;
}

:deep(.el-input__wrapper) {
    background-color: var(--el-input-bg-color);
}


</style>
