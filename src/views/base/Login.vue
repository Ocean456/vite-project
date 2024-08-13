<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {login as apiLogin} from '../../api'
import router from '../../router'
import {ElMessage} from 'element-plus'
import {userStore} from '../../store'
import {Close} from '@element-plus/icons-vue'

const username = ref('')
const password = ref('')
const loading = ref(false)

const {setToken} = userStore()

const login = async () => {
    try {
        const res = await apiLogin(username.value, password.value)
        if (res.status === 200) {
            const token = res.headers['authorization'].split(' ')[1]
            localStorage.setItem('token', token)
            setToken(token)
            await router.push('/main')
        } else {
            ElMessage.warning('登录失败' + res.data)
        }
    } catch (error: any) {
        if (error.response.status === 401) {
            ElMessage.warning('用户名或密码错误')
        } else {
            ElMessage.warning('服务器错误')
        }
    }
}

const handleClose = () => {
    window.electronAPI?.close()

}

onMounted(() => {
    const token = localStorage.getItem('token')
    if (token) {
        setToken(token)
        router.push('/main')
    } else {
        window.electronAPI?.setWindow({width: 400, height: 370})
    }

})
</script>

<template>
    <div id="login">
        <el-card class="card drag" v-loading="loading" element-loading-text="登录成功...正在加载">
            <div class="close-wrapper no-drag" @click="handleClose">
                <el-icon class="close">
                    <Close/>
                </el-icon>
            </div>
            <template #header>
                <div class="login-title">登录</div>
            </template>
            <div class="form-wrapper">
                <el-form class="no-drag">
                    <el-form-item>
                        <el-input v-model="username" placeholder="请输入账号">

                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="password" placeholder="请输入密码" type="password"
                                  @keyup.enter="login"></el-input>
                    </el-form-item>
                    <div class="no-drag" style="display:flex; margin-top: -12px">
                        <el-link :underline="false" style="font-size: 12px;color: #c0c4cc">忘记密码？</el-link>
                        <div class="flex-grow"></div>
                        <el-link @click="router.push('/register')" :underline="false" style="font-size: 12px;color: #c0c4cc">没有账号？去注册</el-link>
                    </div>
                </el-form>
                <el-button class="button no-drag" type="primary" @click="login">登录</el-button>

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
    width: 360px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: none;
    position: relative;
}

.login-title {
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
    /*    border-bottom: 1px solid #ebeef5;*/
    border-bottom: 1px solid #d5d8df;
    height: 40px;
    background-color: transparent;

}

:deep(.el-card) {
    background-color: #f5f7fa;
}

:deep(.el-input__inner) {
    text-align: center;
    line-height: 40px;
    letter-spacing: 0.1em;
    height: 40px;
}

.close-wrapper {
    position: absolute;
    top: 0;
    right: 0;
    width: 35px;
    height: 25px;
    border-radius: 0 5px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.close {
    cursor: pointer;
    color: #909399;
    transition: color 0.3s;
}

.close-wrapper:hover {
    background-color: #c74e4e;
}

.flex-grow {
    flex-grow: 1;
}
</style>/style>
