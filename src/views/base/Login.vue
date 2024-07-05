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
            userStore().setToken(token)
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

<!--

<script setup lang="ts">

import {ArrowDown, Close, Hide, Lock, Minus, UserFilled, View} from "@element-plus/icons-vue";
import {computed, ref} from "vue";
import {login as apiLogin} from "../../api";
import {userStore} from "../../store";
import {ElMessage} from "element-plus";
import router from "../../router";

// Define variables to store the username and password
const username = ref('');
const password = ref('');

// Function to handle login
const handleLogin = () => {
    apiLogin(username.value, password.value).then((res) => {
        if (res.status == 200) {
            const Header = res.headers['authorization']
            const token = Header.split(' ')[1]
            localStorage.setItem('token', token)
            userStore().setToken(token)
            userStore().setUsername(res.data.username)
            sessionStorage.setItem('username', res.data.username)
            router.push('/chat')
        } else {
            ElMessage.warning('登录失败')
        }
    })
    console.log('Login button clicked. Username:', username.value, 'Password:', password.value);
};

// Function to handle registration
/*const handleRegistration = () => {

    console.log('Register button clicked.');
};*/

// Function to handle forgot password
/*const handleForgotPassword = () => {

    console.log('Forgot Password clicked.');
};*/

const showPassword = ref(true);
const type = computed(() => showPassword.value ? 'password' : 'text');
</script>


<template>
    <div class="container">
        <div class="navigation">
            <div class="minimize">
                <el-icon>
                    <Minus/>
                </el-icon>
            </div>
            <div class="close">
                <el-icon>
                    <Close/>
                </el-icon>
            </div>
        </div>
        <div class="form-container">
            <div class="avatar">

            </div>
            <div class="form">
                <div class="username">
                    <div class="icon">
                        <UserFilled style="width: 80%"/>
                    </div>
                    <div class="username-details input">
                        <input type="text" v-model="username" placeholder="Username">
                    </div>
                    <div class="icon">
                        <ArrowDown style="width: 80%"/>
                    </div>
                </div>
                <div class="password">
                    <div class="icon">
                        <Lock style="width: 80%"/>
                    </div>
                    <div class="password-details input">
                        <input :type="type" v-model="password" placeholder="Password">
                    </div>
                    <div class="icon" @click="showPassword=!showPassword">
                        <View v-if="showPassword" style="width: 80%"/>
                        <Hide v-if="!showPassword" style="width: 80%"/>
                    </div>
                </div>
                <div class="function">
                    <div @click="router.push('/register')">
                        立即注册
                    </div>
                    <div>
                        忘记密码
                    </div>
                </div>
                <div class="login" @click="handleLogin">
                    登录
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 29vw;
    height: 42vh;
    margin: auto;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-image: radial-gradient(closest-side, rgba(70, 130, 180, 0.9), rgba(0, 0, 128, 0)),
    radial-gradient(closest-side, rgba(138, 43, 226, 0.9), rgba(138, 43, 226, 0)),
    radial-gradient(closest-side, rgba(186, 85, 211, 0.9), rgba(186, 85, 211, 0)),
    radial-gradient(closest-side, rgba(0, 0, 205, 0.9), rgba(0, 0, 205, 0)),
    radial-gradient(closest-side, rgba(123, 104, 238, 0.9), rgba(123, 104, 238, 0)),
    radial-gradient(closest-side, rgba(218, 112, 214, 0.9), rgba(218, 112, 214, 0)),
    radial-gradient(closest-side, rgba(255, 105, 180, 0.9), rgba(255, 105, 180, 0));
    background-size: 30vmax 45vmax, 20vmax 30vmax, 25vmax 38vmax, 35vmax 48vmax, 30vmax 43vmax,
    28vmax 40vmax, 22vmax 32vmax;
    background-position: -10vmax -10vmax, 10vmax 10vmax, -5vmax 5vmax, 10vmax -10vmax, 5vmax 5vmax,
    20vmax 20vmax, -18vmax -18vmax;
    background-repeat: no-repeat;
    animation: move 10s linear infinite;
}

@keyframes move {
    0%, 100% {
        background-size: 30vmax 45vmax, 20vmax 30vmax, 25vmax 38vmax, 35vmax 48vmax, 30vmax 43vmax,
        28vmax 40vmax, 22vmax 32vmax;
        background-position: -10vmax -10vmax, 10vmax 10vmax, -5vmax 5vmax, 10vmax -10vmax, 5vmax 5vmax,
        20vmax 20vmax, -18vmax -18vmax;
    }
    10% {
        background-size: 32vmax 47vmax, 23vmax 33vmax, 28vmax 40vmax, 40vmax 55vmax, 32vmax 45vmax,
        30vmax 42vmax, 24vmax 34vmax;
        background-position: -8vmax -8vmax, 8vmax 8vmax, -4vmax 4vmax, 8vmax -8vmax, 4vmax 4vmax,
        15vmax 15vmax, -14vmax -14vmax;
    }
    20% {
        background-size: 34vmax 50vmax, 26vmax 36vmax, 31vmax 44vmax, 42vmax 58vmax, 34vmax 48vmax,
        32vmax 45vmax, 24vmax 35vmax;
        background-position: -6vmax -6vmax, 6vmax 6vmax, -3vmax 3vmax, 6vmax -6vmax, 3vmax 3vmax,
        10vmax 10vmax, -10vmax -10vmax;
    }
    30% {
        background-size: 36vmax 52vmax, 28vmax 38vmax, 34vmax 47vmax, 45vmax 62vmax, 36vmax 50vmax,
        34vmax 48vmax, 26vmax 37vmax;
        background-position: -5vmax -5vmax, 5vmax 5vmax, -2vmax 2vmax, 5vmax -5vmax, 2vmax 2vmax,
        7vmax 7vmax, -7vmax -7vmax;
    }
    40% {
        background-size: 38vmax 55vmax, 30vmax 41vmax, 37vmax 50vmax, 49vmax 68vmax, 38vmax 52vmax,
        36vmax 50vmax, 28vmax 40vmax;
        background-position: -4vmax -4vmax, 4vmax 4vmax, -1vmax 1vmax, 4vmax -4vmax, 1vmax 1vmax,
        5vmax 5vmax, -5vmax -5vmax;
    }
    50% {
        background-size: 40vmax 58vmax, 32vmax 44vmax, 40vmax 55vmax, 54vmax 75vmax, 40vmax 55vmax,
        38vmax 53vmax, 30vmax 42vmax;
        background-position: -3vmax -3vmax, 3vmax 3vmax, 0, 3vmax -3vmax, 0,
        3vmax 3vmax, -3vmax -3vmax;
    }
    60% {
        background-size: 38vmax 55vmax, 30vmax 41vmax, 37vmax 50vmax, 49vmax 68vmax, 38vmax 52vmax,
        36vmax 50vmax, 28vmax 40vmax;
        background-position: -4vmax -4vmax, 4vmax 4vmax, -1vmax 1vmax, 4vmax -4vmax, 1vmax 1vmax,
        5vmax 5vmax, -5vmax -5vmax;
    }
    70% {
        background-size: 36vmax 52vmax, 28vmax 38vmax, 34vmax 47vmax, 45vmax 62vmax, 36vmax 50vmax,
        34vmax 48vmax, 26vmax 37vmax;
        background-position: -5vmax -5vmax, 5vmax 5vmax, -2vmax 2vmax, 5vmax -5vmax, 2vmax 2vmax,
        7vmax 7vmax, -7vmax -7vmax;
    }
    80% {
        background-size: 34vmax 50vmax, 26vmax 36vmax, 31vmax 44vmax, 42vmax 58vmax, 34vmax 48vmax,
        32vmax 45vmax, 24vmax 35vmax;
        background-position: -6vmax -6vmax, 6vmax 6vmax, -3vmax 3vmax, 6vmax -6vmax, 3vmax 3vmax,
        10vmax 10vmax, -10vmax -10vmax;
    }
    90% {
        background-size: 32vmax 47vmax, 23vmax 33vmax, 28vmax 40vmax, 40vmax 55vmax, 32vmax 45vmax,
        30vmax 42vmax, 24vmax 34vmax;
        background-position: -8vmax -8vmax, 8vmax 8vmax, -4vmax 4vmax, 8vmax -8vmax, 4vmax 4vmax,
        15vmax 15vmax, -14vmax -14vmax;
    }
}

.form-container {
    height: 70%;
    background: aliceblue;
    position: relative;
    top: 30%;
}

.navigation {
    display: flex;
    justify-content: flex-end;
}

.minimize, .close {
    width: 1.25vw;
    height: 1.25vw;
    padding: 0.5vw;
    color: white;
}

.minimize:hover {
    background-color: rgba(255, 247, 250, 0.5);
}

.close:hover {
    background-color: rgba(255, 0, 0, 0.5);
}

.avatar {
    width: 5vw;
    height: 5vw;
    background-color: aliceblue;
    border-radius: 50%;
    border: #ded5d5 1px solid;
    box-shadow: 0 0 10px rgba(140, 172, 245, 0.5);
    position: relative;
    left: 50%;
    transform: translate(-50%, -50%);
}

.form {
    width: 60%;
    height: calc(100% - 2.5vw);
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
}

.form .username, .password, .function, .login {
    width: 100%;
    height: 20%;
    display: flex;
    justify-content: space-between;
}

.login {
    background-color: #07bbfa;
    font-size: 1rem;
    justify-content: center;
    align-items: center;
    color: white;
    transform: translateY(-50%);
    border-radius: 3px;
    user-select: none;
}

.login:hover {
    background-color: #4ed1ff;
}

.form .username, .password {
    border-bottom: 1px solid black;
}

.form .icon {
    width: 10%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form .input {
    width: 70%;
    height: 100%;
}

.form .input input[type="password"], .form .input input[type="text"] {
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    outline: none;
    background-color: transparent;
    text-shadow: 0 0 0 black;
    font-size: 1rem;
}

input[type="password"]::-ms-reveal {
    display: none
}

.function {
    font-size: 0.5rem;
    color: rgb(128, 128, 128);
}

.function div {
    cursor: pointer;
}

.function div:hover {
    color: black;
}

</style>
-->
