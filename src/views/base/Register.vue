<script setup lang="ts">
import {register as apiRegister, sendEmailCode, login as apiLogin} from "../../request";
import {onMounted, ref} from "vue";
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
        ElMessage.error("两次密码不一致");
        return;
    }
    apiRegister(username.value, password.value, email.value, code.value).then((res) => {
        username.value = res.data.username
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
        userStore().init(token, res.data.username)
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

onMounted(() => {
    window.electronAPI?.setWindow({width: 400, height: 480})
});
</script>

<template>
    <div id="register">
        <el-card class="card drag" v-loading="isRegistering" element-loading-text="注册中...">
            <div class="back-wrapper no-drag" @click="router.push('/login')">
                <el-icon class="back">
                    <Back/>
                </el-icon>
            </div>
            <template #header>
                <div class="register-title">注册</div>
            </template>
            <div class="form-wrapper">
                <el-form class="no-drag">
                    <el-form-item>
                        <el-input v-model="email" placeholder="邮箱">
                            <template #append>
                                <el-button :disabled="isButtonDisabled" @click="getCode">
                                    {{ isButtonDisabled ? `${countdown}s` : '发送验证码' }}
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="code" placeholder="验证码"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="password" placeholder="密码" type="password" show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="repeatPassword" placeholder="重复密码" type="password"
                                  show-password></el-input>
                    </el-form-item>
                </el-form>
                <el-button class="button no-drag" type="primary" @click="register" :disabled="isRegistering">
                    {{ isRegistering ? `注册中... ${delay}s` : '注册' }}
                </el-button>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
#register {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.card {
    width: 360px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 5px;
    box-shadow: none;
    border: none;
    position: relative;
}

.register-title {
    text-align: center;
    font-size: 20px;
    margin-top: 20px;
}

.form-wrapper {
    width: 90%;
    max-width: 300px;
    margin: 0 auto;
    padding-bottom: 15px;
}

.button {
    width: 100%;
    margin-top: 20px;
    height: 40px;
}

:deep(.el-card__header) {
    border-bottom: none;
}

:deep(.el-input__wrapper) {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
    border-bottom: 1px solid #d5d8df;
    height: 40px;
    background-color: transparent;
}

:deep(.el-card) {
    background-color: #f5f7fa;
}

:deep(.el-input__inner) {
    line-height: 40px;
    letter-spacing: 0.1em;
    height: 40px;
}

.back-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 35px;
    height: 25px;
    border-radius: 0 5px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.back {
    cursor: pointer;
    color: #909399;
    transition: color 0.3s;
}

.back-wrapper:hover {
    background-color: #d9ecff;
}

.flex-grow {
    flex-grow: 1;
}

:deep(.el-input-group__append) {
    /*border: 1px solid #d5d8df;*/
    border-bottom: 1px solid #d5d8df;
    height: 42px;
    box-shadow: none;
}
</style>
<!--MailParseException-->
