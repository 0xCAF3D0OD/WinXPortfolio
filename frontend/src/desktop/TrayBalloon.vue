<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Bulle de notification façon XP, ancrée au-dessus de la zone de notification.
// Apparaît après un délai, reste un moment, puis disparaît ; fermable.
const props = withDefaults(defineProps<{ startAfter?: number; duration?: number }>(), {
  startAfter: 3000,
  duration: 15000,
})

const start = ref(false)
const show = ref(true)
let openTimer = 0
let fadeTimer = 0
let closeTimer = 0

onMounted(() => {
  openTimer = window.setTimeout(() => (start.value = true), props.startAfter)
  fadeTimer = window.setTimeout(() => (show.value = false), props.startAfter + props.duration)
  closeTimer = window.setTimeout(
    () => (start.value = false),
    props.startAfter + props.duration + 1000,
  )
})
onBeforeUnmount(() => {
  clearTimeout(openTimer)
  clearTimeout(fadeTimer)
  clearTimeout(closeTimer)
})

function dismiss() {
  show.value = false
}
</script>

<template>
  <div v-if="start" class="balloon" :class="{ out: !show }">
    <div class="balloon__container" @click="dismiss">
      <button class="balloon__close" aria-label="Fermer" @click.stop="dismiss"></button>
      <div class="balloon__header">
        <img class="balloon__header__img" src="/xp/windowsIcons/229(16x16).png" alt="" />
        <span>Votre ordinateur est peut-être en danger</span>
      </div>
      <p class="balloon__text1">Aucun antivirus ne semble installé.</p>
      <p class="balloon__text2">Cliquez sur cette bulle pour résoudre le problème.</p>
    </div>
  </div>
</template>

<style scoped>
.balloon {
  position: fixed;
  right: 34px;
  bottom: 38px;
  z-index: 11000;
  opacity: 0;
  animation: balloon-in 1s forwards;
  filter: drop-shadow(2px 2px 1px rgba(0, 0, 0, 0.4));
  font-family: Tahoma, 'Noto Sans', sans-serif;
}
.balloon.out {
  animation: balloon-out 1s forwards;
}
@keyframes balloon-in {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes balloon-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.balloon__container {
  position: relative;
  border: 1px solid #000;
  border-radius: 7px;
  padding: 6px 28px 10px 10px;
  background: #ffffe1;
  font-size: 11px;
  color: #000;
  white-space: nowrap;
  cursor: pointer;
}
/* Pointe orientée vers le bas (vers la zone de notification) */
.balloon__container::before {
  content: '';
  position: absolute;
  bottom: -19px;
  right: 14px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 19px 19px 0 0;
  border-color: #000 transparent transparent transparent;
}
.balloon__container::after {
  content: '';
  position: absolute;
  bottom: -17px;
  right: 15px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 18px 18px 0 0;
  border-color: #ffffe1 transparent transparent transparent;
}
.balloon__close {
  position: absolute;
  right: 4px;
  top: 4px;
  width: 14px;
  height: 14px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  background: transparent;
  outline: none;
  cursor: pointer;
}
.balloon__close::before,
.balloon__close::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  height: 8px;
  width: 2px;
  background: #aaa;
}
.balloon__close::before {
  transform: rotate(45deg);
}
.balloon__close::after {
  transform: rotate(-45deg);
}
.balloon__close:hover {
  background: #ffa90c;
  border-color: #fff;
  box-shadow: 1px 1px rgba(0, 0, 0, 0.1);
}
.balloon__close:hover::before,
.balloon__close:hover::after {
  background: #fff;
}
.balloon__header {
  display: flex;
  align-items: center;
  font-weight: 700;
}
.balloon__header__img {
  width: 14px;
  height: 14px;
  margin-right: 8px;
}
.balloon__text1 {
  margin: 5px 0 8px;
}
.balloon__text2 {
  margin: 0;
}
</style>
