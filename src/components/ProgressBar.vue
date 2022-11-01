<template>
  <div class="progress" :class="{ progress__playing: musicStore.isPlaying }">
    <h2 class="progress_title">
      {{ formatName(name) }}
    </h2>
    <p class="progress_text">
      {{ formatTime(position) }} / {{ formatTime(duration) }}
    </p>
    <div class="progress_line" @click="setPosition" ref="lineRef">
      <span :style="{ width: progress }"></span>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { player } from "../player.js";
import useMusicStore from "../stores/music.js";

const name = ref("");
const position = ref(0);
const duration = ref(0.001);
const progress = ref("");
const musicStore = useMusicStore();
const lineRef = ref(null);

const setPosition = (ev) => {
  let lineHeight = parseFloat(getComputedStyle(lineRef.value).width);
  let rate = ev.offsetX / lineHeight;
  player.position = rate;
};

const formatName = (name) => {
  return name.replace(/\.mp3$/, "");
};

const formatTime = (val) => {
  const min = Math.floor(val / 60);
  const sec = Math.floor(val % 60);
  return `${min}:${sec < 10 ? "0" + sec : sec}`;
};

onMounted(() => {
  const draw = () => {
    window.requestAnimationFrame(draw);
    const curProgress = player.position / player.duration;
    progress.value = `${(curProgress * 100).toFixed(2)}%`;
    position.value = player.position;
    duration.value = player.duration;
    name.value = player.current.file ? player.current.file.name : "";
  };
  draw();
});
</script>

<style scoped>
.progress {
  padding-left: 40%;
  padding-right: 5%;
  width: 100%;
  height: 100%;

  border-radius: 8px 8px 0 0;
  background-color: rgba(210, 210, 210, 0.8);
  transition: all 0.6s ease;
}

.progress__playing {
  transform: translateY(-90%);
}
.progress_title {
  padding-top: 6px;
  font-size: 14px;
  font-weight: bold;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.progress_text {
  padding-top: 2px;
  font-size: 16px;
  font-weight: bold;
  color: #aaa;
  transform: scale(0.8);
  transform-origin: left top;
}

.progress_line {
  height: 6px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #fff;
}
.progress_line span {
  display: block;
  height: 100%;
  background-color: #ec51a5;
}
</style>
