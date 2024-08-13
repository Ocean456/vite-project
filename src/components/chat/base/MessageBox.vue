<template>
    <div id="message" style="padding: 20px;">
        <div v-for="message in msg" :key="message.id" :class="[message.position, 'message-container']">
            <div class="message" :class="message.position">
                <div v-if="message.isImage">
                    <ContextMenu :menu="[
                        {label: '保存图片'}
                    ]"
                                 @select="handleClick(message.text.substring(6))"
                    >
                        <el-image :src="message.text.substring(6)" alt="Image" class="image no-drag"
                                  lazy
                                  :preview-src-list="[message.text.substring(6)]" fit="cover"/>
                    </ContextMenu>
                </div>
                <div v-else class="text" v-html="message.text"></div>
            </div>
        </div>
        <a id="a"></a>
    </div>
</template>
<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";
import {userStore} from "../../../store";
import ContextMenu from "../../ContextMenu.vue";

interface Message {
    id: string,
    text: string,
    position: string,
    sender: string,
    isImage?: boolean,
    // type: 'text' | 'image' | 'file' | 'video' | 'audio'
}

interface Props {
    data: {
        messages: Message[]
    }
}

const props = defineProps({
        data: Object
    }
)


const msg = ref([{
    id: '',
    text: '',
    position: '',
    isImage: false
}])

const init = (props: Props) => {
    msg.value = props.data.messages.map((message) => ({
        id: message.id,
        text: message.text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;'),
        position: message.sender === userStore().username ? 'right' : 'left',
        isImage: message.text.startsWith('image:')
    }));

};

const handleClick = (str: string) => {
    const a = document.getElementById('a') as HTMLAnchorElement;
    a.href = str;
    a.download = '';
    a.click();

}

onMounted(() => {
    init(<Props>props);

})

watchEffect(() => {
    init(<Props>props)
})
</script>

<style scoped>
#message {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.message-container {
    display: flex;
    justify-content: flex-start;
    border-radius: 10px;
    max-width: 70%;

}

.message {
    padding: 10px;
    border-radius: 10px;
}

.left {
    align-self: flex-start;
    background-color: var(--el-text-bg-color-secondary);
}

.right {
    align-self: flex-end;
    background-color: var(--el-text-bg-color-third);
}

.text {
    font-size: 16px;
    user-select: text;
    word-break: break-word;
    white-space: pre-wrap;
    line-height: 1.5;
}

.time {
    font-size: 12px;
    color: #888;
}

.image {
    width: 100%;
    max-width: 500px;
}

:deep(.el-image-viewer__wrapper) {
    padding: 10% 10%;
}

:deep(.el-image-viewer__close) {
    margin-top: 50px;
}

:deep(.el-image-viewer__img) {
    max-width: 100vw;
}
</style>
