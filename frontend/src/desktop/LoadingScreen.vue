<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{ done: [] }>()
let timer: number

onMounted(() => {
  timer = window.setTimeout(() => emit('done'), 4200)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="loading" @click="emit('done')">
    <div class="logo">
      <img class="flag" src="/xp/windoors.svg" alt="" />
      <span class="wordmark"><b>windoors</b><i>xp</i></span>
    </div>
    <div class="progress"><span></span></div>
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
  align-items: center;
  gap: 16px;
}
.flag {
  width: 64px;
  height: 58px;
}
.wordmark {
  display: flex;
  align-items: baseline;
  gap: 6px;
  color: #fff;
  letter-spacing: 0.5px;
}
.wordmark b {
  font-size: 34px;
  font-weight: 400;
}
.wordmark i {
  font-size: 28px;
  font-weight: 700;
  font-style: italic;
  color: #ff9f17;
}

.progress {
  width: 150px;
  height: 16px;
  border: 1px solid #5a5a5a;
  border-radius: 9px;
  overflow: hidden;
  position: relative;
}
.progress span {
  position: absolute;
  top: 2px;
  left: 0;
  height: 10px;
  width: 44px;
  border-radius: 6px;
  background: linear-gradient(to right, #1247a6, #3f8cf3, #1247a6);
  animation: slide 2.1s linear infinite;
}
@keyframes slide {
  0% {
    left: -46px;
  }
  100% {
    left: 150px;
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
