<template>
  <div class="control" :class="{ control__playing: musicStore.isPlaying }">
    <div class="control_btn control_btn__side" @click="handlePrev">
      <i class="fa fa-backward" />
    </div>
    <div class="control_btn" @click="handlePlay">
      <span class="play-btn"></span>
    </div>
    <div class="control_btn control_btn__side" @click="handleNext">
      <i class="fa fa-forward" />
    </div>
  </div>
</template>

<script setup>
import { player } from "../player.js";
import useMusicStore from "../stores/music.js";

const musicStore = useMusicStore();
const handlePrev = () => {
  if (musicStore.isPlaying) {
    player.prev();
  }
};

const handlePlay = () => {
  if (!player.isEmpty) {
    if (!musicStore.isPlaying) {
      player.play();
    } else {
      player.pause();
    }
  }
};
const handleNext = () => {
  if (musicStore.isPlaying) {
    player.next();
  }
};
</script>

<style scoped>
.control {
  display: flex;
  justify-content: space-between;
  align-items: center;

  height: 100%;
  position: relative;
}

.control_btn {
  color: #aaa;
  font-size: 16px;
  border-radius: 4px;
  width: 40px;
  height: 40px;

  display: flex;
  justify-content: center;
  align-items: center;
}

.control_btn:hover {
  background-color: #aaa;
  color: #fff;
}

.control_btn__side {
  font-size: 16px;
}

.play-btn {
  display: inline-block;
  position: relative;
  left: 2px;
  width: 20px;
  height: 20px;
}

.play-btn::before {
  content: "";
  position: absolute;

  width: 0;
  height: 0;

  border: 14px solid transparent;
  border-top-width: 10px;
  border-bottom-width: 10px;
  border-left-color: #aaa;

  transition: all 0.2s ease;
}

.play-btn::after {
  content: "";
  position: absolute;

  width: 0;
  height: 20px;

  border: 0 solid transparent;
  border-width: 0 0 0 6px;

  border-left-color: #aaa;

  transition: all 0.2s ease;

  opacity: 0;
  transform: scale(0);
}

.control__playing .play-btn::before {
  border-width: 0 0 0 6px;
  height: 20px;
  left: 8px;
}

.control__playing .play-btn::after {
  opacity: 1;
  transform: scale(1);
}

.control_btn:hover .play-btn::before {
  border-left-color: #fff;
}

.control_btn:hover .play-btn::after {
  border-color: white;
}
</style>
