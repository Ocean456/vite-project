<script setup lang="ts">

</script>

<template>
  <div id="menu">
    <div class="logo">
      <img src="../assets/logo.svg" alt="logo" width="40px" height="40px">
    </div>
    <div class="flex"></div>
<!--    <el-dropdown-menu>
      <el-dropdown-item>Profile</el-dropdown-item>
      <el-dropdown-item>Settings</el-dropdown-item>
      <el-dropdown-item>Logout</el-dropdown-item>
    </el-dropdown-menu>-->
  </div>
</template>

<style scoped>
#menu{
  display: flex;
  align-items: center;
  height: 70px;
  padding: 0 20px;
  background-color: #f5f5f5;
}
.flex{
  flex: 1;
}
</style>