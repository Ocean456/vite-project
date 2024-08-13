<script setup lang="ts">
import {ChatLineRound, Moon, Plus, Refresh, Setting, SwitchButton, Tickets} from "@element-plus/icons-vue";
import {userStore} from "../../store";
import router from "../../router";
import {nextTick} from "vue";

const logout = async () => {
    userStore().logout()
    await nextTick();
    if (router.currentRoute.value.path !== '/login') {
        await router.push('/login');
    }
}


const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
}

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

            <el-menu-item class="no-drag">
                <el-icon>
                    <Tickets/>
                </el-icon>
                <span slot="title">群组</span>
            </el-menu-item>
            <el-menu-item class="no-drag" @click="$emit('addition')">
                <el-icon>
                    <Plus/>
                </el-icon>
            </el-menu-item>
            <el-menu-item class="no-drag" @click="$emit('refresh')">
                <el-icon>
                    <Refresh/>
                </el-icon>
                <span slot="title">刷新</span>
            </el-menu-item>
            <el-menu-item class="menu-dark no-drag" @click="toggleTheme">
                <el-icon>
                    <Moon/>
                </el-icon>
                <span slot="title">深色</span>
            </el-menu-item>
            <el-menu-item class=" no-drag" @click="logout">
                <el-icon>
                    <SwitchButton/>
                </el-icon>
                <span slot="title">退出</span>
            </el-menu-item>

            <div class="flex-grow"></div>
            <el-menu-item class="menu-setting no-drag">
                <el-icon>
                    <Setting/>
                </el-icon>
                <span slot="title">设置</span>
            </el-menu-item>
        </el-menu>
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

/*.menu-setting {
    position: absolute;
    bottom: 0;
}*/

.flex-grow {
    flex-grow: 1;
}


</style>
