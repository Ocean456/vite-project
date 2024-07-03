<script setup lang="ts">
import {ref, watch, onMounted} from "vue";
import {getPersonalInfo, modifyPersonalInfo} from "../api";
import {pcaTextArr} from "element-china-area-data";
import {userStore} from "../store";
import {ElMessage} from "element-plus";

const userInfo = ref({
    nickname: '',
    avatar: '',
    email: '',
    phone: '',
    region: '',
});

const username = ref('')

const emit = defineEmits(['close']);

const selectedArea = ref<string[]>([]);

const loadUserInfo = async () => {
    const res = await getPersonalInfo();
    userInfo.value = {
        nickname: res.data.nickname,
        avatar: res.data.avatar,
        email: res.data.email,
        phone: res.data.phone,
        region: res.data.region,
    }
    username.value = userStore().username
    selectedArea.value = userInfo.value.region.split(' ');
};

watch(selectedArea, (val) => {
    userInfo.value.region = val.join(' ');
});

onMounted(loadUserInfo);

const modify = () => {
    modifyPersonalInfo(userInfo.value.nickname,
        userInfo.value.avatar,
        userInfo.value.email,
        userInfo.value.phone,
        userInfo.value.region,
    ).then(() => {
        ElMessage.success('修改成功')
        emit('close');
    }).catch(() => {
        ElMessage.error('修改失败')
    })


}
</script>

<template>
    <div id="information">
        <el-card class="card" shadow="never" style="border: none">
            <div class="centered-content">
                <el-avatar shape="square" style="margin-bottom: 30px" size="large" :src="userInfo.avatar"></el-avatar>
            </div>
            <!--            <div>
                            <el-button class="button" size="small" type="primary">更换头像</el-button>
                        </div>-->
            <el-form label-width="100px" style="margin-right: 40px">
                <el-form-item label="用户名">
                    <el-input v-model="username" placeholder="用户名" disabled></el-input>
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="userInfo.nickname" placeholder="昵称"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="userInfo.email" placeholder="邮箱"></el-input>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="userInfo.phone" placeholder="手机号"></el-input>
                </el-form-item>
                <el-form-item label="区域">
                    <el-cascader
                        :options="pcaTextArr"
                        v-model="selectedArea"
                        style="width: 100%"
                        separator=" "
                        placeholder="请选择省市区">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div class="centered-content">
                <el-button class="button" type="primary" @click="modify">修改</el-button>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.centered-content {
    display: flex;
    align-items: center;
    flex-direction: column;
}
</style>