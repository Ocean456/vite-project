// friends message card
<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
// import {zhCN} from 'date-fns/locale';
import {messageStore} from "../../store";
import {format, isToday, isYesterday, isThisWeek, isThisYear} from 'date-fns';

const props = defineProps({
    contact: {
        type: Object,
        required: true,
        default: () => ({
            nickname: '',
            username: '',
            avatar: '',
            lastMessage: '',
            lastMessageTime: '',
            unreadMessages: 0,
            type: ''
        })
    }
});

const screenWidth = ref(window.innerWidth);

onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth;
    });
});

const showContactTime = computed(() => {
    // return screenWidth.value > 1280;
    return true;
});

const handleTimeShow = (time: string) => {
    const date = new Date(time);

    if (isToday(date)) {
        return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
        return 'Yesterday';
    } else if (isThisWeek(date)) {
        // return format(date, 'EEEE', { locale: zhCN });
        return format(date, 'EEEE')
    } else if (isThisYear(date)) {
        return format(date, 'MM-dd');
    }
};
const switchUser = () => {
    if (props.contact.username) {
        messageStore().switchUser(props.contact.username, props.contact.avatar, props.contact.nickname, props.contact.type);
    }
};

const isActiveUser = computed(() => messageStore().other === props.contact.username);
</script>

<template>
    <div id="contact-card">
        <el-card class="contactCard" :class="{active: isActiveUser}" shadow="never" @click="switchUser">
            <div class="message-card">
                <div class="avatar">
                    <el-badge :value="contact.unreadMessages" class="item custom-badge" :max="10" is-dot hidden>
                        <el-avatar :src="contact.avatar" :size="35"></el-avatar>
                    </el-badge>
                </div>
                <div class="content">
                    <div class="line">
                        <span class="name">{{ contact.nickname }}</span>
                        <div style="flex-grow: 1"></div>
                        <span class="time" v-show="showContactTime">{{ handleTimeShow(contact.lastMessageTime) }}</span>
                    </div>
                    <p class="last">{{ contact.lastMessage }}</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.message-card {
    display: flex;
    align-items: center;
    height: 60px;
    width: 100%;
}

.content {
    display: flex;
    flex-direction: column;
    margin-left: 1px;
    margin-top: 10px;
    margin-right: 10px;
    overflow: hidden;
    width: inherit;
    font-size: 0.9em;
}

#contact-card {
    height: 10%;
}

.contactCard {
    height: 60px;
    padding: 2px 0 0 10px;
    border-radius: 0;
}

:deep(.el-card__body) {
    padding: 0;
}

.avatar {
    margin-right: 10px;
    margin-left: 10px;
    width: 40px;
    height: 40px;
}

.message-card p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 2px;
    font-size: small;
    color: #8c8c8c;
}

.line p {
    margin-top: 5px;
    text-align: center;
}

.name {
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: bold;
}

.time {
    font-size: x-small;
    color: #8c8c8c;
    white-space: nowrap;
    margin-right: 5px;
    margin-top: 2px;
}

.line {
    display: flex;
}

.active {
    background-color: var(--el-anchor-active-color);
}


</style>
