<script setup lang="ts">

import {onMounted, ref} from 'vue'

import {createGroup} from '../../request'
import {ElMessage} from "element-plus";

const form = ref({
    name: '',
    image: '',
    description: ''
})

const submitForm = () => {
    console.log(form.value)
    createGroup(form.value.name, form.value.image, form.value.description).then(() => {
        ElMessage.success('创建成功')
    })
}

const resetForm = () => {
    form.value = {
        name: '',
        image: '',
        description: ''
    }
}

const AfterUpload = (res: any) => {
    form.value.image = res
    console.log(form.value)
}

const token = localStorage.getItem('token')

onMounted(() => {

})
</script>

<template>
    <div id="group-create" class="drag">
        <el-card class="card " shadow="never">
            <template #header>
                创建群组
            </template>
            <el-form :model="form" label-width="80px" class="no-drag">
                <el-form-item label="群组名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="群组头像">
                    <el-upload
                        style="flex-direction: column;display: flex"
                        action="http://localhost:1010/api/image/upload"
                        :headers="{Authorization: 'Bearer ' + token}"
                        :on-success="AfterUpload"
                        :show-file-list="false"
                    >
                        <template #trigger>
                            <el-button v-if="!form.image" type="primary" size="small">上传图片</el-button>
                        </template>
                        <el-image v-if="form.image" :src="form.image" class="avatar "
                                  :preview-src-list="[form.image]"></el-image>
                    </el-upload>
                </el-form-item>
                <el-form-item label="群组简介">
                    <el-input type="textarea" v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm">创建</el-button>
                    <el-button @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<style scoped>
.card {
    height: 100%;
    background-color: var(--el-bg-color);
    border: none;
}

.avatar {
    width: 100px;
    height: 100px;
}

:deep(.el-image-viewer__close) {
    margin-top: 50px;
}

:deep(.el-image-viewer__actions) {
    display: none;
}

</style>
