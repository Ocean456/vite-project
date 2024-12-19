<script setup lang="ts">
import {
    ChatLineRound, Odometer, Plus,
    Refresh,
    Setting,
    Tickets
} from "@element-plus/icons-vue";
import {settingStore, userStore} from "../../store";
import router from "../../router";
import {nextTick, onMounted, ref, watch} from "vue";

const logout = async () => {
    userStore().logout()
    await nextTick();
    if (router.currentRoute.value.path !== '/login') {
        await router.push('/login');
    }
}

const setting = ref(false);

const theme = ref<string>()

const themeSetting = ref<boolean>(false)

const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    settingStore().setTheme(theme.value)
}


watch(theme, (val) => {
    document.documentElement.classList.toggle('dark')
    themeSetting.value = val === 'dark'
})


onMounted(() => {
    theme.value = settingStore().getTheme()
})

</script>

<template>
    <div id="sidebar-menu">
        <el-menu class="menu drag"
                 :unique-opened="true"
                 :collapse="true"
                 mode="vertical"
        >
            <div class="user-avatar no-drag" style="margin-top: 20px;">
                <el-avatar :src="userStore().avatar" :size="30" @click="$emit('info')"></el-avatar>
            </div>
            <el-menu-item class="no-drag">
                <el-icon>
                    <ChatLineRound/>
                </el-icon>
                <span slot="title">消息</span>
            </el-menu-item>
            <el-menu-item class="no-drag" @click="$emit('addContact')">
                <el-icon>
                    <Plus/>
                </el-icon>
                <span slot="title">添加</span>
            </el-menu-item>

            <el-sub-menu class="no-drag">
                <template #title>
                    <el-icon>
                        <Tickets/>
                    </el-icon>
                </template>
                <el-menu-item style="height: 40px;" class="no-drag" @click="$emit('joinGroup')">
                    <span slot="title">添加群组</span>
                </el-menu-item>
                <el-menu-item style="height: 40px;" class="no-drag" @click="$emit('createGroup')">
                    <span slot="title">创建群组</span>
                </el-menu-item>
            </el-sub-menu>

            <el-menu-item class="no-drag" @click="$emit('refresh')">
                <el-icon>
                    <Refresh/>
                </el-icon>
                <span slot="title">刷新</span>
            </el-menu-item>
            <div class="flex-grow"></div>
            <el-menu-item class="no-drag" @click="router.push('/statistics')">
                <el-icon>
                    <Odometer/>
                </el-icon>
                <span slot="title">统计</span>
            </el-menu-item>
            <el-menu-item @click="setting=!setting" class="menu-setting no-drag">
                <el-icon>
                    <Setting/>
                </el-icon>
                <span slot="title">设置</span>
            </el-menu-item>
        </el-menu>
        <el-drawer class="no-drag" v-model="setting" :append-to-body="true" :show-close="false">
            <div class="theme-setting">
                <el-text>主题：</el-text>
                <el-switch v-model="themeSetting" active-text="深色" inactive-text="浅色" size="small"
                           @change="toggleTheme" class="setting-switch"></el-switch>
            </div>
            <el-button @click="logout" style="width: 100%; margin-top: 20px">退出登录</el-button>
        </el-drawer>
    </div>
</template>

<style scoped>
.menu {
    border-radius: 4px 0 0 4px;
    backdrop-filter: blur(10px);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 15px 0;
}


.flex-grow {
    flex-grow: 1;
}


.theme-setting {
    display: flex;
    font-family: "Helvetica", "SourceHanSans", sans-serif;
}


</style>
