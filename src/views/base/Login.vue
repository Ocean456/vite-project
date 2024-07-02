<script setup lang="ts">
import {ref} from 'vue'
import {login as apiLogin} from "../../api";
import index from "../../router";
import {ElMessage} from "element-plus";
import {userStore} from "../../store";


const username = ref('18478002720')
const password = ref('123456')
const login = () => {
    apiLogin(username.value, password.value).then((res) => {
        if (res.status == 200) {
            const Header = res.headers['authorization']
            const token = Header.split(' ')[1]
            localStorage.setItem('token', token)
            userStore().setUsername(res.data.username)
            sessionStorage.setItem('username', res.data.username)
            index.push('/chat')
        } else {
            ElMessage.warning('登录失败')
        }
    })
}
</script>

<template>
    <div id="login">
        <el-card class="card">
            <el-form>
                <el-form-item label="账号">
                    <el-input v-model="username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="password" placeholder="密码" type="password"></el-input>
                </el-form-item>
            </el-form>
            <div class="button-group">
                <el-button class="button" type="primary" @click="login">登录</el-button>
                <el-button class="button" type="primary" @click="$router.push('/register')">注册</el-button>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
#login {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.card {
    width: 400px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
}

.button {
    max-width: 150px;
    width: 100%;
    margin-top: 20px;
}

.button-group {
    display: flex;
    justify-content: space-between;
    max-width: 90%;
    margin-left: 5%;
}
</style>