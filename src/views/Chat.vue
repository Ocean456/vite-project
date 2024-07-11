<!--suppress HtmlUnknownTag -->
<script setup lang="ts">

import {onMounted, ref} from "vue";
import {getContacts, getPersonalInfo} from "../api";
import {contactStore, messageStore, userStore} from "../store";
import Contact from "../components/contact/Contact.vue";
// import Header from "../components/Menu.vue";
import Interface from "../components/chat/Interface.vue";
import AddContact from "../components/contact/AddContact.vue";
import InfoCard from "../components/contact/InfoCard.vue";
import Information from "../components/Information.vue";
import {SwitchButton} from "@element-plus/icons-vue";
import router from "../router";

interface ContactItem {
    contactUsername: string;
    contactNickname: string;
    contactAvatar: string;
    contactStatus: string;
}

const contacts = ref<ContactItem[]>([])
const loading = ref(true)
const visibleContact = ref(false)
const visibleInfo = ref(false)

const loadUserInfo = () => {
    getPersonalInfo().then((res) => {
        messageStore().selfAvatar = res.data.avatar
    })
}

const initializeContacts = async () => {
    await getContacts().then((res) => {
        contacts.value = res.data
        loading.value = false
        contactStore().setContacts(res.data)
    })
    if (contacts.value.length > 0) {
        messageStore().other = contacts.value[0].contactUsername
        messageStore().otherAvatar = contacts.value[0].contactAvatar
        messageStore().otherNickname = contacts.value[0].contactNickname
    }
    loadUserInfo()
}

onMounted(() => {
    initializeContacts();
})


/*const showDialog = () => {
    visible.value = true
}*/

const handleInfoDialog = () => {
    console.log('click')
}

const logout = () => {
    userStore().logout()
    messageStore().clear()
    contactStore().clear()
    router.push('/login')
}

const search = ref('')

const refresh = () => {
    loading.value = true
    setTimeout(() => {
        initializeContacts()
        loading.value = false
    }, 1500)
}
</script>

<template>
    <div id="chat" >
        <el-container class="container" v-loading='loading' element-loading-text="Loading...">
            <el-container>
                <el-menu class="menu"
                         :unique-opened="true"
                         :collapse="true"
                         mode="vertical"
                         style="background-color: #f5f5f5"
                >
                    <div class="user-avatar" style="margin-top: 15px;">
                        <el-tooltip effect="light" trigger="click">
                            <template #content>
                                <InfoCard :username="messageStore().self"/>
                            </template>
                            <el-avatar @click="handleInfoDialog" :src="messageStore().selfAvatar"
                                       :size="30"></el-avatar>
                        </el-tooltip>
                    </div>
                    <el-menu-item>
                        <el-icon>
                            <ChatLineRound/>
                        </el-icon>
                        <span slot="title">消息</span>
                    </el-menu-item>
                    <el-menu-item @click="visibleContact = true">
                        <el-icon>
                            <User/>
                        </el-icon>
                        <span slot="title">联系人</span>
                    </el-menu-item>

                    <el-menu-item class="menu-refresh" @click="refresh">
                        <el-icon>
                            <Refresh/>
                        </el-icon>
                        <span slot="title">刷新</span>
                    </el-menu-item>
                    <el-menu-item class="menu-exit" @click="logout">
                        <el-icon>
                            <SwitchButton/>
                        </el-icon>
                        <span slot="title">退出</span>
                    </el-menu-item>
                    <el-menu-item class="menu-setting" @click="visibleInfo = true">
                        <el-icon>
                            <Setting/>
                        </el-icon>
                        <span slot="title">设置</span>
                    </el-menu-item>
                </el-menu>
                <el-aside class="aside">
                    <el-scrollbar>
                        <div>
                            <el-input size="default" v-model="search" placeholder="搜索" clearable
                                      style="padding: 15px 10px">
                                <template #prepend>
                                    <el-icon>
                                        <Search/>
                                    </el-icon>
                                </template>
                            </el-input>
                            <div v-for="contact in contacts" :key="contact.contactUsername">
                                <Contact class="contact" v-bind="contact"/>
                            </div>
                        </div>
                        <div v-show="!loading">
                            <!--                            <el-button style="margin-top: 20px;width: 80%;margin-left: 10%;" type="info"
                                                                   class="button" @click="showDialog">添加联系人
                                                        </el-button>-->
                        </div>
                    </el-scrollbar>
                </el-aside>
                <el-main class="main">
                    <Interface v-show="!loading"/>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog class="addContact" v-model="visibleContact" :show-close="false">
            <AddContact/>
        </el-dialog>
        <el-dialog v-model="visibleInfo" :show-close="false" width="500">
            <Information @close="visibleInfo=false"/>
        </el-dialog>

    </div>
</template>

<style scoped>
.aside {
    min-width: 180px;
    max-width: 250px;
    width: 20%;
    /*    height: calc(100vh - 60px);*/
    height: 100vh;
    background-color: white;
}

.header {
    max-height: 80px;
    padding: 0;
}

.contact :hover {
    background-color: #f5f5f5;
}

.container {
    user-select: none;
}

.main {
    padding: 0;
    /*
    max-height: calc(100vh - 60px);
    */
    max-height: 100vh;
}

/*.el-scrollbar {
    height: calc(100vh - 60px);
    overflow-y: auto;
    position: relative;
}*/

.button {
    width: 100%;
}

:deep(.el-dialog) {
    max-width: 430px;
    min-width: 400px;
}

.menu-setting {
    position: absolute;
    bottom: 0;
}


.user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px 0 15px 0;
}

:deep(.el-input-group__prepend) {
    background-color: #f5f5f5;
    padding: 8px;
}

:deep(.el-input__wrapper) {
    background-color: #f5f5f5;
}

</style>