<template>
    <div id="message">
        <div v-for="message in msg" :key="message.text" :class="[message.position, 'message-container']">
            <div class="message" :class="message.position">
                <div class="text">
                    {{ message.text }}
                </div>
                <!--                &lt;!&ndash;
                                <div v-if="message.showTime" class="time">
                                    {{ message.time }}
                                </div>&ndash;&gt;-->
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";
import {messageStore} from "../../store";

interface Message {
    text: string,
    position: string,
    sender: string
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
    text: '',
    position: ''
}])

const init = (props: Props) => {
    msg.value = props.data.messages.map((message) => ({
        text: message.text,
        position: message.sender === messageStore().self ? 'right' : 'left'
    }));
};
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
}

.message {
    /*
    max-width: 70%;
    */
    padding: 10px;
    border-radius: 10px;
}

.left {
    align-self: flex-start;
    background-color: #f5f5f5;
}

.right {
    align-self: flex-end;
    background-color: #d4e6f1;
}

.text {
    font-size: 16px;
}

.time {
    font-size: 12px;
    color: #888;
}
</style>
