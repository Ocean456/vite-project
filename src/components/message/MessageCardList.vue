<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import MessageCard from "./MessageCard.vue";
import {contactStore, groupStore} from "../../store";
import ContextMenu from "../util/ContextMenu.vue";

interface Contact {
    nickname: string,
    username: string,
    avatar: string,
    lastMessage: string,
    lastMessageTime: string,
    unreadMessages: number,
    type: string
}

interface Group {
    nickname: string,
    username: string,
    avatar: string,
    lastMessage: string,
    lastMessageTime: string,
    unreadMessages: number,
    type: string
}

const input = ref('')
const contacts = ref<Contact[]>([])
const groups = ref<Group[]>([])
const choose = ref('')

const fetchMessages = async (identifier: string, type: string) => {
    const messagesJson = await window.electronAPI.getMessages(identifier, type)
    return JSON.parse(messagesJson)
}

const processList = async (list: any[], type: string, key: string) => {
    const promises = list.map(async (item: any) => {
        const messages = await fetchMessages(item[key], type)
        const lastMessage = messages[messages.length - 1] || {}
        const unreadMessages = messages.filter((message: any) => message.status === 0).length

        return {
            nickname: item.name || item.nickname,
            username: item.number || item.username,
            avatar: item.avatar,
            lastMessage: lastMessage.content?.startsWith('image:') ? '[图片]' : lastMessage.content || '',
            lastMessageTime: lastMessage.timestamp || '',
            unreadMessages,
            type
        }
    })

    return await Promise.all(promises)
}

const loadContacts = async () => {
    const contactList = contactStore().getContacts()
    contacts.value = await processList(contactList, 'friend', 'username')
}

const loadGroups = async () => {
    const groupList = groupStore().getGroups()
    groups.value = await processList(groupList, 'group', 'number')
}

const combinedList = computed(() => {
    return [...contacts.value, ...groups.value].sort((a, b) => {
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime()
    })
})


watch(input, (newVal) => {
    if (newVal === '') {
        loadContacts()
        loadGroups()
    } else {
        contacts.value = contacts.value.filter((contact: any) => contact.nickname.includes(newVal))
        groups.value = groups.value.filter((group: any) => group.nickname.includes(newVal))
    }
})


watch(() => contactStore().getContacts(), async () => {
    await loadContacts();
});

watch(() => groupStore().getGroups(), async () => {
    await loadGroups();
});



onMounted(() => {
    loadContacts();
    loadGroups();

/*    emitter.on('refresh', debounce(() => {
        loadContacts();
        loadGroups();
    }, 500))*/
})

watch(choose, (newVal) => {
    console.log(newVal)
})
</script>

<template>
    <div id="contact">
        <ContextMenu class="block"
                     :menu="[
                         {label: '添加'},
                         {label: '编辑'},
                         {label: '删除'}
                     ]"
                     @select="choose = $event.label"
        >
            <el-input size="default" v-model="input" placeholder="搜索" clearable
                      style="padding: 15px 15px; margin-bottom: 3.5px">
                <template #prepend>
                    <el-icon>
                        <Search/>
                    </el-icon>
                </template>
            </el-input>
            <el-scrollbar>
                <div v-for="item in combinedList" :key="item.username">
                    <MessageCard :contact="item"/>
                </div>
            </el-scrollbar>
        </ContextMenu>
    </div>
</template>

<style scoped>
:deep(.el-input-group__prepend) {
    background-color: var(--el-bg-color-overlay);
}
</style>
