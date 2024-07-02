<script setup lang="ts">

import {reactive} from "vue";

const config = reactive({
  max: 3,
})
</script>

<template>
  <el-config-provider :message="config">
    <router-view class="router"></router-view>
  </el-config-provider>
</template>

<style scoped>
.router {
  height: 100vh;
}

</style>
