<script setup lang="ts">
import { computed } from 'vue'
import { useWindows, type WinState } from './useWindows'

const props = defineProps<{ win: WinState }>()
const { focus, close, minimize, toggleMaximize } = useWindows()

const MIN_W = 240
const MIN_H = 150

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

// --- Déplacement (barre de titre) ---
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

// --- Redimensionnement (8 poignées) ---
let dir = ''
let rsX = 0
let rsY = 0
let oX = 0
let oY = 0
let oW = 0
let oH = 0
function onResize(e: PointerEvent) {
  const dx = e.clientX - rsX
  const dy = e.clientY - rsY
  if (dir.includes('e')) props.win.w = Math.max(MIN_W, oW + dx)
  if (dir.includes('s')) props.win.h = Math.max(MIN_H, oH + dy)
  if (dir.includes('w')) {
    const w = Math.max(MIN_W, oW - dx)
    props.win.x = oX + (oW - w)
    props.win.w = w
  }
  if (dir.includes('n')) {
    const h = Math.max(MIN_H, oH - dy)
    props.win.y = Math.max(0, oY + (oH - h))
    props.win.h = h
  }
}
function onResizeUp() {
  window.removeEventListener('pointermove', onResize)
  window.removeEventListener('pointerup', onResizeUp)
}
function startResize(e: PointerEvent, d: string) {
  if (props.win.maximized) return
  focus(props.win)
  dir = d
  rsX = e.clientX
  rsY = e.clientY
  oX = props.win.x
  oY = props.win.y
  oW = props.win.w
  oH = props.win.h
  window.addEventListener('pointermove', onResize)
  window.addEventListener('pointerup', onResizeUp)
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

    <!-- Poignées de redimensionnement -->
    <template v-if="!win.maximized">
      <div class="rz n" @pointerdown.stop="startResize($event, 'n')"></div>
      <div class="rz s" @pointerdown.stop="startResize($event, 's')"></div>
      <div class="rz e" @pointerdown.stop="startResize($event, 'e')"></div>
      <div class="rz w" @pointerdown.stop="startResize($event, 'w')"></div>
      <div class="rz ne" @pointerdown.stop="startResize($event, 'ne')"></div>
      <div class="rz nw" @pointerdown.stop="startResize($event, 'nw')"></div>
      <div class="rz se" @pointerdown.stop="startResize($event, 'se')"></div>
      <div class="rz sw" @pointerdown.stop="startResize($event, 'sw')"></div>
    </template>
  </div>
</template>

<style scoped>
.window {
  position: absolute;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 240px;
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
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #fff;
}
.window-body > :deep(*) {
  flex: 1;
  min-height: 0;
}

/* Poignées de redimensionnement (zones invisibles sur les bords/coins) */
.rz {
  position: absolute;
  z-index: 2;
}
.rz.n {
  top: 0;
  left: 6px;
  right: 6px;
  height: 4px;
  cursor: ns-resize;
}
.rz.s {
  bottom: 0;
  left: 6px;
  right: 6px;
  height: 5px;
  cursor: ns-resize;
}
.rz.e {
  top: 6px;
  bottom: 6px;
  right: 0;
  width: 5px;
  cursor: ew-resize;
}
.rz.w {
  top: 6px;
  bottom: 6px;
  left: 0;
  width: 4px;
  cursor: ew-resize;
}
.rz.ne {
  top: 0;
  right: 0;
  width: 8px;
  height: 8px;
  cursor: nesw-resize;
}
.rz.nw {
  top: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: nwse-resize;
}
.rz.se {
  bottom: 0;
  right: 0;
  width: 10px;
  height: 10px;
  cursor: nwse-resize;
}
.rz.sw {
  bottom: 0;
  left: 0;
  width: 8px;
  height: 8px;
  cursor: nesw-resize;
}
</style>
