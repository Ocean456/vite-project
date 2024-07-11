<script setup lang="ts">
import {register as apiRegister, sendEmailCode, login as apiLogin} from "../../api";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {userStore} from "../../store";
import {Back} from "@element-plus/icons-vue";

const email = ref('');
const code = ref('');
const username = ref('');
const password = ref('');
const repeatPassword = ref('');
const countdown = ref(0);
const isButtonDisabled = ref(false);
const delay = ref(5);
const isRegistering = ref(false);
const router = useRouter();

const register = () => {
    if (password.value !== repeatPassword.value) {
        ElMessage.error("密码不匹配");
        return;
    }
    apiRegister(username.value, password.value, email.value, code.value).then((res) => {
        ElMessage.success(res.data);
        startDelay();
    }).catch((err) => {
        ElMessage.error(err.response.data);
    });
};

const startCountdown = () => {
    countdown.value = 60;
    isButtonDisabled.value = true;
    const interval = setInterval(() => {
        countdown.value--;
        if (countdown.value <= 0) {
            clearInterval(interval);
            isButtonDisabled.value = false;
        }
    }, 1000);
};

const startDelay = () => {
    isRegistering.value = true;
    const interval = setInterval(() => {
        delay.value--;
        if (delay.value <= 0) {
            clearInterval(interval);
            login();
        }
    }, 1000);
};

const login = () => {
    apiLogin(username.value, password.value).then((res) => {
        ElMessage.success("登录成功");
        const Header = res.headers['authorization']
        const token = Header.split(' ')[1]
        localStorage.setItem('token', token)
        userStore().setToken(token)
        userStore().setUsername(res.data.username)
        sessionStorage.setItem('username', res.data.username)
        router.push("/chat");
    }).catch((err) => {
        ElMessage.error(err.response.data);
    });
};

const getCode = () => {
    sendEmailCode(email.value).then((res) => {
        ElMessage.success(res.data);
        startCountdown();
    }).catch((err) => {
        console.log(err);
    });
};
</script>

<template>
    <div class="register">
        <el-card class="card" >
            <template #header>
                <div class="header-container">
                    <div class="back-icon" @click="router.push('/login')">
                        <el-icon>
                            <Back style="margin-top: 4px"/>
                        </el-icon>
                    </div>
                    <div class="title" >注册</div>
                </div>
            </template>
            <el-form label-width="70px" style="margin-top: 10px;margin-right: 10px">
                <el-form-item label="邮箱">
                    <el-input v-model="email" placeholder="邮箱">
                        <template #append>
                            <el-button :disabled="isButtonDisabled" @click="getCode">
                                {{ isButtonDisabled ? `${countdown}s` : '发送验证码' }}
                            </el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="验证码">
                    <el-input v-model="code" placeholder="验证码"></el-input>
                </el-form-item>
                <el-form-item label="账号">
                    <el-input v-model="username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="password" placeholder="密码" type="password"></el-input>
                </el-form-item>
                <el-form-item label="重复密码">
                    <el-input v-model="repeatPassword" placeholder="重复密码" type="password"></el-input>
                </el-form-item>
            </el-form>
            <el-button class="button" type="primary" @click="register" :disabled="isRegistering">
                {{ isRegistering ? `注册中... ${delay}s` : '注册' }}
            </el-button>
        </el-card>
    </div>
</template>

<style scoped>
.register {
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
    margin-left: 30%;
    width: 100%;
    margin-top: 10px;
}


.title{
    flex: 1;
    text-align: center;
    font-size: 20px;
}

.header-container{
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.header-container .back-icon{
    position: absolute;
    left: 5px;

}
</style>