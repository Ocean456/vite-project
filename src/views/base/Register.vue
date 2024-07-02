<script setup lang="ts">
import {register as apiRegister} from "../../api";
import {ref} from "vue";

const username = ref('')
const password = ref('')
const register = () => {
  apiRegister(username.value, password.value).then((res) => {
    console.log(res)
  }).catch(() => {
    console.log('注册失败')
  })
}
</script>

<template>
  <div class="register">
    <el-card class="card">
      <el-form>
        <el-form-item label="账号">
          <el-input v-model="username" placeholder="账号"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" placeholder="密码" type="password"></el-input>
        </el-form-item>
      </el-form>
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