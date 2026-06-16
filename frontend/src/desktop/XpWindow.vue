<script setup lang="ts">
import { computed } from 'vue'
import { useWindows, type WinState } from './useWindows'

const props = defineProps<{ win: WinState }>()
const { focus, close, minimize, toggleMaximize } = useWindows()

const style = computed(() => {
  if (props.win.maximized) return { zIndex: props.win.z }
  return {
    left: props.win.x + 'px',
    top: props.win.y + 'px',
    width: props.win.w + 'px',
    height: props.win.h + 'px',
    zIndex: props.win.z,
  }
})

let startX = 0
let startY = 0
let originX = 0
let originY = 0

function onMove(e: PointerEvent) {
  props.win.x = originX + (e.clientX - startX)
  props.win.y = Math.max(0, originY + (e.clientY - startY))
}
function onUp() {
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerup', onUp)
}
function startDrag(e: PointerEvent) {
  if (props.win.maximized) return
  focus(props.win)
  startX = e.clientX
  startY = e.clientY
  originX = props.win.x
  originY = props.win.y
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
</script>

<template>
  <div
    v-show="!win.minimized"
    class="window"
    :class="{ maximized: win.maximized }"
    :style="style"
    @pointerdown="focus(win)"
  >
    <div class="title-bar" @pointerdown="startDrag" @dblclick="toggleMaximize(win)">
      <div class="title-bar-text">
        <img :src="win.icon" alt="" />
        <span>{{ win.title }}</span>
      </div>
      <div class="title-bar-controls">
        <button aria-label="Minimize" @pointerdown.stop @click.stop="minimize(win)"></button>
        <button
          :aria-label="win.maximized ? 'Restore' : 'Maximize'"
          @pointerdown.stop
          @click.stop="toggleMaximize(win)"
        ></button>
        <button aria-label="Close" @pointerdown.stop @click.stop="close(win)"></button>
      </div>
    </div>
    <div class="window-body">
      <component :is="win.component" />
    </div>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 260px;
}
.window.maximized {
  inset: 0;
  width: auto !important;
  height: auto !important;
  border-radius: 0;
}

.title-bar {
  flex-shrink: 0;
  cursor: default;
  user-select: none;
}
.title-bar-text {
  flex: 1;
  min-width: 0;
}

.window-body {
  flex: 1;
  min-height: 0;
  margin: 0 3px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}
.window-body > :deep(*) {
  flex: 1;
  min-height: 0;
}
</style>
