<script setup lang="ts">
import {ref} from "vue";

const props = defineProps<{
    menu: { label: string }[]
}>()

const emit = defineEmits(['select'])

import useContextMenu from './useContextMenu.ts'

const containerRef = ref<HTMLElement | null>(null)
const {x, y, showMenu} = useContextMenu(containerRef)


function handleBeforeEnter(el: HTMLElement) {
    el.style.height = '0'
}

function handleEnter(el: HTMLElement) {
    el.style.height = 'auto'
    const h = el.clientHeight
    el.style.height = '0'
    requestAnimationFrame(() => {
        el.style.height = (h - 20) + 'px'
        el.style.transition = 'height 0.3s'
    })
}

function handleAfterEnter(el: HTMLElement) {
    el.style.transition = 'none'
}

function handleClick(item: any) {
    emit('select', item)
}
</script>

<template>
    <div ref="containerRef">
        <slot></slot>
        <Teleport to="body">
            <Transition @beforeEnter="handleBeforeEnter" @enter="handleEnter" @afterEnter="handleAfterEnter">
                <div v-if="showMenu" :style="{top: `${y}px`, left: `${x}px`}" class="context-menu">
                    <div class="menu-list">
                        <div @click="handleClick(item)" class="menu-item" v-for="item in props.menu"
                             :key="item.label">
                            <el-text>{{ item.label }}</el-text>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
.context-menu {
    position: fixed;
    background-color: var(--el-menu-bg-color-secondary);
    border-radius: 3px;
    z-index: 9999;
    padding: 10px;
    width: 120px;
    border: 1px solid var(--el-border-color);
}

.menu-item {
    padding: 5px 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    border-radius: 3px;
}

.menu-item:hover {
    background-color: var(--el-menu-item-hover-bg-color);
}
</style>
