<script setup lang="ts">
import {ref} from "vue";
import {searchGroup, joinGroup, sendMessageToGroup} from "../../request";
import {groupStore, userStore} from "../../store";
import {ElNotification} from "element-plus";

const groupName = ref('');

interface SearchResultItem {
    name: string,
    number: string,
    description: string,
    avatar: string,
    memberCount: number,
    ownerName: string,
    ownerAvatar: string,
}

const result = ref<SearchResultItem[]>([]);

const performSearch = async () => {
    await searchGroup(groupName.value).then((res) => {
        result.value = res.data;
        console.log(result.value);
    });
};

const isGroupAlreadyAdded = (groupName: string) => {
    // @ts-ignore
    return groupStore().groups.some(group => group.groupName === groupName);
};

const add = (number: string) => {
    joinGroup(number).then(() => {
        ElNotification({
            title: '添加成功',
            type: 'success',
        });
        result.value = result.value.filter(item => item.number !== number);
        sendMessageToGroup(userStore().username, number, '你好，我是' + userStore().nickname).then((res) => {
            const message = JSON.stringify([res.data]);
            window.electronAPI.saveMessages(message, 'group');
        });
    });
};
</script>

<template>
    <div id="addGroup">
        <el-card class="card" shadow="never">
            <el-input v-model="groupName" placeholder="请输入群组名" @keydown.enter="performSearch">
                <template #append>
                    <el-button type="primary" @click="performSearch">搜索</el-button>
                </template>
            </el-input>
            <el-divider></el-divider>
            <el-scrollbar height="400">
                <div v-for="item in result" :key="item.name">
                    <el-card class="result-card" shadow="hover">
                        <div class="card-content">
                            <span>{{ item.name }}</span>
                            <div class="spacer"></div>
                            <span class="groupDescription">{{ item.description }}</span>
                            <el-button size="small" type="primary" v-if="!isGroupAlreadyAdded(item.groupName)"
                                       @click="add(item.number)">添加
                            </el-button>
                            <el-text type="info" v-else>已添加</el-text>
                        </div>
                    </el-card>
                </div>
                <div>
                    <el-empty v-if="result.length === 0" description="暂无群组"></el-empty>
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

.groupDescription {
    margin-right: 20px;
}
</style>
