<script setup lang="ts">
import {computed, defineProps, onMounted, ref} from "vue";
import {messageStore} from "../../store";

const props = defineProps({
    contactNickname: String,
    contactUsername: String,
    contactAvatar: String,
    lastMessage: String,
    lastMessageTime: String,
    unreadMessages: Number
})

const screenWidth = ref(window.innerWidth)

onMounted(() => {
    window.addEventListener('resize', () => {
        screenWidth.value = window.innerWidth
    })

})


const showContactTime = computed(() => {
    return screenWidth.value > 1280
})

const switchUser = () => {
    if (props.contactUsername) {
        messageStore().setOther(props.contactUsername)
        messageStore().setOtherAvatar(<string>props.contactAvatar)
        messageStore().setOtherNickname(<string>props.contactNickname)
    }
}

const isActiveUser = computed(() => messageStore().other === props.contactUsername);

</script>

<template>
    <div id="contact">
        <el-card class="contactCard" :class="{active:isActiveUser}" shadow="never" @click="switchUser">
            <div class="message">
                <div class="avatar">
                    <!--          <el-badge :show-zero="false"  :value="unreadMessages">-->
                    <el-avatar :src="contactAvatar"></el-avatar>
                    <!--          </el-badge>-->
                </div>
                <div class="content" v-bind="props">
                    <div class="line">
                        <span class="name" ref="contactNameRef">{{ contactNickname }}</span>
                        <div style="flex-grow: 1"></div>
                        <span class="time" v-show="showContactTime">{{ lastMessageTime }}</span>
                    </div>
                    <p class="last">{{ lastMessage }}</p>
                </div>
            </div>
        </el-card>
    </div>
</template>

<style scoped>
.message {
    display: flex;
    align-items: center;
    height: 80px;
    width: 100%;
    padding: 2px 0;
}

.content {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
    margin-top: 14px;
    margin-right: 10px;
    overflow: hidden;
    width: inherit;
}

#contact {
    height: 10%;
}

.contactCard {
    height: 80px;
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

.message p {
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
    /*    font-weight: bold;*/
    font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
    background-color: #f5f5f5;
}

/*.avatar {
  float: right;
  margin-top: -10px;
}

.text {
  margin-top: 10px;
}

.time {
  margin-top: 10px;
  text-align: right;
}

.item {
  padding: 0 20px;
}*/
</style>