<script setup lang="ts">
import {defineEmits} from 'vue';

const emit = defineEmits(['selectEmoji']);

const emojis = ['😀', '😂', '😍', '😎', '😭', '😡', '👍', '👎', '🙏', '👏'];

const handleEmojiClick = (emoji: string) => {
    emit('selectEmoji', emoji);
};
</script>

<template>
    <div id="emoji">
        <div v-for="emoji in emojis" :key="emoji" @click="handleEmojiClick(emoji)">
            {{ emoji }}
        </div>
    </div>
</template>

<style scoped>
#emoji {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    background-color: #f0f9eb;
}

#emoji div {
    cursor: pointer;
    font-size: 16px;
    padding: 4px;
}
</style>