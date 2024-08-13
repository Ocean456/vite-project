<script setup lang="ts">
import {Close, FullScreen, Minus} from "@element-plus/icons-vue";

const handleMinimize = () => {
    window.electronAPI?.minimize()
}

const handleMaximize = () => {
    window.electronAPI?.maximize()
}

const handleHide = () => {
    window.electronAPI?.hide()
}
</script>

<template>
    <div id="window-controls" class="no-drag">
        <el-button link @click="handleMinimize">
            <el-icon>
                <Minus/>
            </el-icon>
        </el-button>
        <el-button link @click="handleMaximize">
            <el-icon>
                <FullScreen/>
            </el-icon>
        </el-button>
        <el-button link @click="handleHide">
            <el-icon>
                <Close/>
            </el-icon>
        </el-button>
    </div>
</template>

<style scoped>
#window-controls {
    width: 100px;
    height: 30px;
    /*background-color: #f0f0f0*/;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
}

</style>