<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import MessageCard from "../../components/card/MessageCard.vue";
import {contactStore, groupStore} from "../../store";
import ContextMenu from "../../components/ContextMenu.vue";

const input = ref('')

const contacts: any = ref([])
const groups: any = ref([])

const loadContacts = async () => {
    const {getContacts} = contactStore()
    const contactList = getContacts()

    const contactPromises = contactList.map(async (contact: any) => {
        const messagesJson = await window.electronAPI.getMessages(contact.username, 'default')
        const messages: any[] = JSON.parse(messagesJson);
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null

        const unreadMessages = messages.filter((message: any) => message.status === 0).length

        return {
            nickname: contact.nickname,
            username: contact.username,
            avatar: contact.avatar,
            lastMessage: lastMessage ? lastMessage.content.startsWith('image:') ? '[图片]' : lastMessage.content : '',
            lastMessageTime: lastMessage ? lastMessage.timestamp : '',
            unreadMessages,
            type: 'default'
        }
    })

    contacts.value = await Promise.all(contactPromises)
}

const loadGroups = async () => {
    const {getGroups} = groupStore()
    const groupList = getGroups()

    const groupPromises = groupList.map(async (group: any) => {
        const messagesJson: string = await window.electronAPI.getMessages(group.number, 'group')
        const messages: any[] = JSON.parse(messagesJson)
        const lastMessage = messages.length > 0 ? messages[messages.length - 1] : null
        const unreadMessages = messages.filter((message: any) => message.status === 0).length

        return {
            nickname: group.name,
            username: group.number,
            avatar: group.avatar,
            lastMessage: lastMessage ? lastMessage.content : '',
            lastMessageTime: lastMessage ? lastMessage.timestamp : '',
            unreadMessages,
            type: 'group'
        }
    })

    groups.value = await Promise.all(groupPromises)
}

const combinedList = computed(() => {
    return [...contacts.value, ...groups.value].sort((a, b) => {
        return new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime();
    })
})

watch(input, (newVal) => {
    if (newVal === '') {
        loadContacts()
        loadGroups()
        return
    }

    const filteredContacts = contacts.value.filter((contact: any) => contact.nickname.includes(newVal))
    const filteredGroups = groups.value.filter((group: any) => group.nickname.includes(newVal))

    contacts.value = filteredContacts
    groups.value = filteredGroups
})

watch(contactStore(), () => {
    loadContacts()
})

watch(groupStore(), () => {
    loadGroups()
})

onMounted(() => {
    loadContacts()
    loadGroups()
})

const choose = ref('')

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
