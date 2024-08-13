<script setup lang="ts">

import {messageStore} from "../../store";
import {onMounted, ref} from "vue";
import {searchContact} from "../../api";

const props = defineProps<{
    username?: string
}>()

interface contact {
    nickname: string,
    username: string,
    avatar: string,
    email: string,
    phone: string,
    area: string
}

const contactInfo = ref<contact>({avatar: "", email: "", nickname: "", phone: "", area: "", username: ""})

onMounted(async () => {
    const username = props.username || messageStore().other
    await searchContact(/*messageStore().other*/username).then((res) => {
        contactInfo.value = res.data[0]
    })
})
</script>

<template>
    <div id="infoCard">
        <el-card class="card" shadow="never">
            <div class="card-content">
                <el-descriptions
                    direction="horizontal"
                    :column="1"
                    size="small"
                >

                    <el-descriptions-item>
                        <el-avatar :src="contactInfo.avatar" size="small"></el-avatar>
                    </el-descriptions-item>
                    <el-descriptions-item label="昵称">{{ contactInfo.nickname }}</el-descriptions-item>
                    <el-descriptions-item label="账号">{{ contactInfo.username }}</el-descriptions-item>
                    <el-descriptions-item label="邮箱">{{ contactInfo.email }}</el-descriptions-item>
                    <el-descriptions-item label="电话">{{ contactInfo.phone }}</el-descriptions-item>
                    <el-descriptions-item label="地区">{{ contactInfo.area }}</el-descriptions-item>
                </el-descriptions>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.card {
    border: none;
}
</style>