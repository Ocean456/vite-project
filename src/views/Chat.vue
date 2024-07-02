<script setup lang="ts">

import {onMounted, ref} from "vue";
import Contact from "../components/Contact.vue";
import Header from "../components/Menu.vue";
import Interface from "../components/chat/Interface.vue";
import {getContacts, getPersonalInfo} from "../api";
import {messageStore} from "../store";

const data = ref()

const loadUserInfo = () => {
    getPersonalInfo().then((res) => {
        messageStore().selfAvatar = res.data.avatar
    })
}


const loading = ref(true)
const init = async () => {
    await getContacts().then((res) => {
        data.value = res.data
        loading.value = false
    })
    loadUserInfo()
}


onMounted(() => {
    init();
})


</script>

<template>
    <div id="chat">
        <el-container class="container">
            <el-header class="header">
                <Header/>
            </el-header>
            <el-container>
                <el-aside class="aside">
                    <el-scrollbar v-loading='loading'>
                        <div v-for="contact in data">
                            <Contact class="contact" v-bind="contact"/>
                        </div>
                    </el-scrollbar>
                </el-aside>
                <el-main class="main">
                    <Interface/>
                </el-main>
            </el-container>
        </el-container>
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