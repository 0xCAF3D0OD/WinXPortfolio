<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{ done: [] }>()
let timer: number

onMounted(() => {
  timer = window.setTimeout(() => emit("done"), 4200)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="loading" @click="emit('done')">
    <div class="logo">
      <img class="flag" src="/xp/windoors.svg" alt="" />
      <span class="wordmark"><b>windoors</b><i>xp</i></span>
    </div>
    <div class="progress"><div class="blocks"><i></i><i></i><i></i></div></div>
    <button class="skip" @click.stop="emit('done')">passer</button>
  </div>
</template>

<style scoped>
.loading {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 46px;
  font-family: Tahoma, sans-serif;
  user-select: none;
  cursor: default;
}
.logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.flag {
  width: 116px;
  height: 105px;
  margin-left: 78px;
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6));
}
.wordmark {
  display: flex;
  align-items: baseline;
  gap: 9px;
  color: #fff;
  letter-spacing: 0.5px;
}
.wordmark b {
  font-size: 42px;
  font-weight: 400;
}
.wordmark i {
  font-size: 42px;
  font-weight: 700;
  font-style: italic;
  color: #ff9f17;
}

.progress {
  width: 124px;
  height: 17px;
  border: 1px solid #4a4a4a;
  border-radius: 9px;
  overflow: hidden;
  position: relative;
  background: #000;
}
.progress .blocks {
  position: absolute;
  top: 3px;
  left: 0;
  display: flex;
  gap: 3px;
  animation: slide 2.4s linear infinite;
}
.progress .blocks i {
  display: block;
  width: 9px;
  height: 10px;
  border-radius: 2px;
  background: linear-gradient(to bottom, #6fb2ff, #1e5fd0 55%, #0b3aa0);
}
@keyframes slide {
  0% {
    transform: translateX(-39px);
  }
  100% {
    transform: translateX(124px);
  }
}
.skip {
  position: absolute;
  bottom: 22px;
  right: 22px;
  background: transparent;
  border: 1px solid #444;
  color: #777;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
