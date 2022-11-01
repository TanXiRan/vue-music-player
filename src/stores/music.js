import { defineStore } from "pinia";
import { ref, computed } from "vue";

let coverIndex = 0;
const COVER_URL = [
  `src/assets/images/cover1.jpg`,
  `src/assets/images/cover2.jpg`,
  `src/assets/images/cover3.jpg`,
];

const useMusicStore = defineStore("muisc", () => {
  const isPlaying = ref(false);
  const coverUrl = ref("");

  const playingState = computed(() => isPlaying.value);

  function togglePlay(payload) {
    isPlaying.value = payload;
  }

  function changeCover() {
    coverUrl.value = COVER_URL[coverIndex++];
    if (coverIndex >= 3) {
      coverIndex = 0;
    }
  }

  return {
    isPlaying,
    coverUrl,
    playingState,
    togglePlay,
    changeCover,
  };
});

export default useMusicStore;
