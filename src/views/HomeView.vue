<template>
  <div class="home">
    <player />
  </div>
</template>

<script setup>
import Player from "../components/Player.vue";
</script>

<style scoped>
.home {
  display: flex;
  width: 100%;
  height: 100%;
  background-color: #ffedff;
  z-index: 0;
  position: relative;
  justify-content: center;
  align-items: center;
}
</style>
