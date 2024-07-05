<script setup lang="ts">

import {onMounted, ref} from "vue";
import Contact from "../components/contact/Contact.vue";
import Header from "../components/Menu.vue";
import Interface from "../components/chat/Interface.vue";
import {getContacts, getPersonalInfo} from "../api";
import {contactStore, messageStore} from "../store";
import AddContact from "../components/contact/AddContact.vue";

interface ContactItem {
    contactUsername: string;
    contactNickname: string;
    contactAvatar: string;
    contactStatus: string;
}

const contacts = ref<ContactItem[]>([])
const loading = ref(true)
const visible = ref(false)

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


const showDialog = () => {
    visible.value = true
}

</script>

<template>
    <div id="chat">
        <el-container class="container" v-loading='loading' element-loading-text="Hello">
            <el-header class="header">
                <Header/>
            </el-header>
            <el-container>
                <el-aside class="aside">
                    <el-scrollbar >
                        <div v-for="contact in contacts" :key="contact.contactUsername">
                            <Contact class="contact" v-bind="contact"/>
                        </div>
                        <div v-show="!loading">
                            <el-button style="margin-top: 20px;width: 80%;margin-left: 10%;" type="info"
                                       class="button" @click="showDialog">添加联系人
                            </el-button>
                        </div>
                    </el-scrollbar>
                </el-aside>
                <el-main class="main">
                    <Interface v-show="!loading"/>
                </el-main>
            </el-container>
        </el-container>
        <el-dialog class="addContact" v-model="visible" :show-close="false">
            <AddContact/>
        </el-dialog>
    </div>
</template>

<style scoped>
.aside {
    min-width: 180px;
    max-width: 250px;
    width: 20%;
    height: calc(100vh - 60px);
    background-color: #f5f5f5;
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

/*.container{
  height: inherit;
}
.aside{
  width: 15%;
}
.header{
  padding: 0;
}
.main{
  padding: 0;
}*/
</style>