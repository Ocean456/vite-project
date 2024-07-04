<script setup lang="ts">
import {ArrowDown} from '@element-plus/icons-vue'
import Information from "./Information.vue";
import {ref} from "vue";
import {userStore} from "../store";
import router from "../router";


const visible = ref(false)

const openDialog = () => {
    visible.value = true
}

const logout = () => {
    userStore().logout()
    router.push('/login')
}
</script>

<template>
    <div id="menu">
        <div class="logo">
            <img src="../assets/logo.svg" alt="logo" width="40px" height="40px">
        </div>
        <div class="flex"></div>
        <el-dropdown>
          <span class="el-dropdown-link">
                <span>菜单</span>
              <el-icon class="el-icon--right">
                  <ArrowDown/>
              </el-icon>
          </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="openDialog">个人信息</el-dropdown-item>
                    <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>
        <el-dialog v-model="visible" :show-close="false" width="500">
            <Information @close="visible=false"/>
        </el-dialog>
    </div>
</template>

<style scoped>
#menu {
    display: flex;
    align-items: center;
    height: 70px;
    padding: 0 20px;
    background-color: #f5f5f5;
}

.flex {
    flex: 1;
}

.el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-info);
    display: flex;
    align-items: center;
    outline: none;
}


</style>