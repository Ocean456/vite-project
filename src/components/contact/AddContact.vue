<script setup lang="ts">
import { ref } from "vue";
import { searchContact, addContact } from "../../api";
import { contactStore } from "../../store";
import { ElNotification } from "element-plus";

const username = ref('');

interface SearchResultItem {
    username: string;
    nickname: string;
    avatar: string;
    status: string;
}

const result = ref<SearchResultItem[]>([]);

const performSearch = async () => {
    await searchContact(username.value).then((res) => {
        result.value = res.data;
    });
};

const isContactAlreadyAdded = (username: string) => {
    // @ts-ignore
    return contactStore().contacts.some(contact => contact.contactUsername === username);
};

const add = (username: string) => {
    addContact(username).then(() => {
        ElNotification({
            title: '添加成功',
            type: 'success',
        });
    });
};
</script>

<template>
    <div id="addContact">
        <el-card class="card" shadow="never">
            <el-input v-model="username" placeholder="请输入用户名">
                <template #append>
                    <el-button type="primary" @click="performSearch">搜索</el-button>
                </template>
            </el-input>
            <el-divider></el-divider>
            <el-scrollbar height="400">
                <div v-for="item in result" :key="item.username">
                    <el-card class="result-card" shadow="hover">
                        <div class="card-content">
                            <span>{{ item.username }}</span>
                            <div class="spacer"></div>
                            <span class="nickname">{{ item.nickname }}</span>
                            <el-button size="small" type="primary" v-if="!isContactAlreadyAdded(item.username)" @click="add(item.username)">添加
                            </el-button>
                            <el-text type="info" v-else>已添加</el-text>
                        </div>
                    </el-card>
                </div>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<style scoped>
.card {
    width: 400px;
    height: 500px;
    border: none;
}

.result-card {
    margin-top: 10px;
}

.card-content {
    display: flex;
    align-items: center;
}

.spacer {
    flex: 1;
}

.nickname {
    margin-right: 20px;
}
</style>
