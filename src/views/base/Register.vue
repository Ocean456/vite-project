<script setup lang="ts">
import {register as apiRegister, sendEmailCode} from "../../api";
import {ref} from "vue";
import {ElMessage} from "element-plus";

const email = ref('')
const code = ref('')

const username = ref('')
const password = ref('')
const register = () => {
    apiRegister(username.value, password.value, email.value, code.value).then((res) => {
        ElMessage.success(res.data)
    }).catch((err) => {
        ElMessage.error(err.response.data)
    })
}

const getCode = () => {
    sendEmailCode(email.value).then((res) => {
        ElMessage.success(res.data)
    }).catch((err) => {
        console.log(err)
    })
}
</script>

<template>
    <div class="register">
        <el-card class="card">
            <el-form label-width="60px">

                <el-form-item label="邮箱">
                    <el-input v-model="email" placeholder="邮箱">
                        <template #append>
                            <el-button @click="getCode">发送验证码</el-button>
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
            </el-form>
<!--            <el-form>

                <el-form-item >
                    <el-input v-model="email" placeholder="邮箱">
                        <template #append>
                            <el-button @click="getCode">发送验证码</el-button>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="code" placeholder="验证码"></el-input>
                </el-form-item>

                <el-form-item >
                    <el-input v-model="username" placeholder="账号"></el-input>
                </el-form-item>
                <el-form-item >
                    <el-input v-model="password" placeholder="密码" type="password"></el-input>
                </el-form-item>


            </el-form>-->
            <el-button class="button" type="primary" @click="register">注册</el-button>
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
    margin-top: 20px;
}
</style>