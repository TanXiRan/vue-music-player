<template>
  <div class="disk" :class="{ disk__playing: musicStore.isPlaying }">
    <label
      for="fileInput"
      class="disk_cover"
      ref="DiskCoverRef"
      :style="{
        transform: stopMatrix,
        backgroundImage: musicStore.coverUrl
          ? `url(${musicStore.coverUrl})`
          : '',
      }"
    ></label>
    <input
      type="file"
      id="fileInput"
      ref="inputRef"
      accept="audio/*"
      multiple
      @change="handleChange"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { player } from "../player.js";
import useMusicStore from "../stores/music.js";

const stopMatrix = ref("");
const DiskCoverRef = ref(null);
const inputRef = ref(null);
const musicStore = useMusicStore();

const handleChange = async () => {
  const target = inputRef.value;
  const files = target.files || [];

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      await player.append(files[i]);
    }
  }
  target.value = "";
};

onMounted(() => {
  player.onPlay.push(() => {
    musicStore.togglePlay(true);
  });

  player.onPause.push(() => {
    musicStore.togglePlay(false);
  });

  player.onChange.push(() => {
    musicStore.changeCover();
  });

  player.onReady.push(() => {
    musicStore.changeCover();
  });
});

watch(
  () => musicStore.isPlaying,
  (val) => {
    if (!val) {
      stopMatrix.value = getComputedStyle(DiskCoverRef.value).transform;
    } else {
      if (stopMatrix.value != "") {
        const matrix = stopMatrix.value;
        stopMatrix.value = "";
        const match = matrix.match(/^matrix\(([^,]+),([^,]+)/);

        let deg = ((Math.atan2(match[2], match[1]) / Math.PI) * 180) % 360;

        const styles = [...document.styleSheets];

        styles.forEach((style) => {
          try {
            const rules = [...style.cssRules];
            rules.forEach((rule) => {
              if (
                rule.type === rule.KEYFRAMES_RULE &&
                rule.name.indexOf("rotateAnima") != -1
              ) {
                rule.cssRules[0].style.transform = `rotate(${deg}deg)`;
                rule.cssRules[1].style.transform = `rotate(${deg + 360}deg)`;
              }
            });
          } catch (error) {}
        });
      }
    }
  }
);
</script>

<style scoped>
.disk {
  overflow: hidden;
  position: relative;

  /**
  * padding 可以 被子元素当成宽高
  * 且背景也是可以在 padding中显示的
   */
  padding-top: 100%;
  border-radius: 50%;
  left: 8px;

  transform: translateY(-50%) scale(0.8);
  transform-origin: center bottom;
  transition: all 0.6s;
}
.disk input {
  display: none;
}
.disk_cover {
  position: absolute;
  /**
  * 4个0 拉伸
   */
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;

  background-image: radial-gradient(circle, #444, #333);
  background-position: center;
  background-size: cover;
}
.disk_cover::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-image: linear-gradient(45deg, white, #daada1);
}
.disk__playing {
  transform: translateY(-60%);
  box-shadow: 0 20px 20px rgba(0, 0, 0, 0.3),
    0 10px 25px rgba(11, 207, 241, 0.8);
}
.disk__playing .disk_cover {
  animation: rotateAnima 6s infinite linear;
}
@keyframes rotateAnima {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
