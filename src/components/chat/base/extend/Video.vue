<script setup lang="ts">
import {VideoPlayer} from "vue-video-player";
import "video.js/dist/video-js.css";

const options = {
  autoplay: false,
  controls: true,
  sources: [{
    src: "https://www.w3schools.com/html/movie.mp4",
    type: "video/mp4",
  }],
};
</script>

<template>
    <video-player class="video" :options="options"></video-player>

</template>

<style scoped>

</style>
