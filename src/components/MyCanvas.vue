<template>
  <div id="my_canvas">
    <canvas class="canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { player } from "../player.js";
import useMusicStore from "../stores/music.js";

const musicStore = useMusicStore();

onMounted(() => {
  let canvas = document.querySelector(".canvas");
  let ctx = canvas.getContext("2d");

  let cWidth = canvas.width;

  let cHeight = canvas.height;

  let grd = ctx.createLinearGradient(0, 0, 0, cHeight);
  grd.addColorStop(1, "green");
  grd.addColorStop(0.5, "yellow");
  grd.addColorStop(0, "red");
  ctx.fillStyle = grd;

  player.amendData(cWidth, cHeight);

  const draw = () => {
    ctx.clearRect(0, 0, cWidth, cHeight);

    player.drawCanvas(cHeight, ctx, musicStore.isPlaying);
    window.requestAnimationFrame(draw);
  };
  draw();
});
</script>

<style scoped>
.canvas {
  max-width: 300px;
  min-height: 130px;
  max-height: 260px;
  width: 60vw;
  border-radius: 15px;
  background-color: #aaa;
  color: rgb(255, 51, 0);
}
</style>
