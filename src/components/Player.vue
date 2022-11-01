<template>
  <div id="player">
    <div class="player">
      <div class="player_disk">
        <disk />
      </div>
      <div class="player_control">
        <control />
      </div>
      <div class="player_progress">
        <progress-bar />
      </div>
    </div>
    <my-canvas />
  </div>
</template>

<script setup>
import Disk from "./Disk.vue";
import Control from "./Control.vue";
import MyCanvas from "./MyCanvas.vue";
import ProgressBar from "./ProgressBar.vue";
</script>

<style scoped>
.player {
  display: flex;
  position: relative;

  max-width: 300px;
  max-height: 75px;

  width: 60vw;
  height: 15vh;

  background-color: white;
  border-radius: 15px;

  box-shadow: 0 30px 50px rgba(0, 0, 0, 0.3), 0 20px 20px rgba(5, 226, 255, 0.3);
}
.player_disk {
  flex: 1.2;
}
.player_control {
  flex: 2;
}
.player_progress {
  position: absolute;

  width: 90%;
  height: 80%;
  top: -10%;
  left: 5%;
  z-index: -1;
}
</style>
