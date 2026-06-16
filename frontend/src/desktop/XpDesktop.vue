<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { apps, type AppDef } from './registry'
import { useWindows } from './useWindows'
import XpWindow from './XpWindow.vue'
import StartMenu from './StartMenu.vue'

const emit = defineEmits<{ logoff: [] }>()
const { windows, open, taskbarToggle, reset } = useWindows()

const selected = ref<string | null>(null)
const startOpen = ref(false)
const clock = ref('')
const muted = ref(false)

function openApp(app: AppDef) {
  open(app)
  startOpen.value = false
}

function logoff() {
  startOpen.value = false
  reset()
  emit('logoff')
}

function tick() {
  clock.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
let timer: number
onMounted(() => {
  tick()
  timer = window.setInterval(tick, 1000 * 20)
  // Ouvre le terminal au démarrage pour donner le ton.
  const term = apps.find((a) => a.id === 'terminal')
  if (term) open(term)
})
onBeforeUnmount(() => clearInterval(timer))

function onDesktopClick() {
  selected.value = null
  startOpen.value = false
}
</script>

<template>
  <div class="desktop" @pointerdown.self="onDesktopClick">
    <div class="area">
      <!-- Icônes du bureau -->
      <div class="icons">
        <button
          v-for="app in apps"
          :key="app.id"
          class="desk-icon"
          :class="{ selected: selected === app.id }"
          @pointerdown.stop="selected = app.id"
          @dblclick="openApp(app)"
        >
          <img class="glyph" :src="app.icon" alt="" />
          <span class="label">{{ app.label }}</span>
        </button>
      </div>

      <!-- Fenêtres -->
      <XpWindow v-for="win in windows" :key="win.id" :win="win" />
    </div>

    <!-- Menu Démarrer -->
    <StartMenu
      v-if="startOpen"
      @open="openApp"
      @logoff="logoff"
      @close="startOpen = false"
    />

    <!-- Barre des tâches -->
    <div class="taskbar">
      <button class="start-btn" :class="{ active: startOpen }" @pointerdown.stop="startOpen = !startOpen">
        <img class="flag" src="/xp/tray/xplogo.png" alt="" />
        <span class="word">démarrer</span>
      </button>
      <div class="tasks">
        <button
          v-for="win in windows"
          :key="win.id"
          class="task"
          :class="{ active: !win.minimized }"
          @click="taskbarToggle(win)"
        >
          <img class="mini" :src="win.icon" alt="" />
          <span class="task-label">{{ win.title }}</span>
        </button>
      </div>
      <div class="tray">
        <img class="tray-ico" src="/xp/tray/bluetooth.png" alt="Bluetooth" title="Bluetooth" />
        <img class="tray-ico" src="/xp/tray/network.png" alt="Réseau" title="Connexion réseau" />
        <img
          class="tray-ico"
          :src="muted ? '/xp/tray/soundoff.png' : '/xp/tray/soundon.png'"
          :alt="muted ? 'Son coupé' : 'Son activé'"
          :title="muted ? 'Son coupé' : 'Volume'"
          @click="muted = !muted"
        />
        <span class="tray-clock">{{ clock }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.desktop {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: Tahoma, Geneva, Verdana, sans-serif;
  background: #3a6ea5 url('/xp/bliss.jpg') center / cover no-repeat;
}
.area {
  position: absolute;
  inset: 0 0 30px 0;
  overflow: hidden;
}

.icons {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px;
  padding: 8px;
  height: 100%;
  width: 100%;
  pointer-events: none;
}
.desk-icon {
  pointer-events: auto;
  width: 84px;
  background: transparent;
  border: 1px dotted transparent;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: default;
  color: #fff;
}
.desk-icon.selected {
  background: rgba(49, 106, 197, 0.4);
  border: 1px dotted #cfe0ff;
}
.glyph {
  width: 38px;
  height: 38px;
  display: inline-flex;
  filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.4));
}
.glyph,
.mini {
  object-fit: contain;
}
.desk-icon .label {
  font-size: 11px;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  line-height: 1.2;
}

.taskbar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 30px;
  display: flex;
  align-items: stretch;
  background-image: linear-gradient(
    0deg,
    #042b8e 0%,
    #0551f6 6%,
    #0453ff 51%,
    #0551f6 63%,
    #0551f6 81%,
    #3a8be8 90%,
    #0453ff 100%
  );
  z-index: 9999;
}
.start-btn {
  height: 100%;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 0 22px 3px 9px;
  white-space: nowrap;
  border: none;
  cursor: pointer;
  font-style: italic;
  font-weight: bold;
  font-size: 17px;
  color: #fff;
  text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.68);
  box-shadow: -2px -2px 10px rgba(0, 0, 0, 0.55) inset;
  border-radius: 0 9px 9px 0;
  background-image: linear-gradient(
    0deg,
    #0c450c 0%,
    #308f2f 6%,
    #308f2f 63%,
    #308f2f 77%,
    #97c597 85%,
    #97c597 93%,
    #308f2f 97%
  );
}
.start-btn:active,
.start-btn.active {
  background-image: linear-gradient(
    0deg,
    #2f892f 0%,
    #4eb64e 6%,
    #4eb64e 63%,
    #4eb64e 77%,
    #c4ffc4 85%,
    #c4ffc4 93%,
    #2f892f 97%
  );
}
.flag {
  width: 20px;
  height: 19px;
  filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.7));
}
.tasks {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 4px;
  overflow: hidden;
}
.task {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 160px;
  height: 80%;
  padding: 0 8px;
  border: 1px solid #255be1;
  border-top: 1px solid #6a98ee;
  border-radius: 3px;
  background: #3980f4;
  box-shadow: 2px 2px 5px rgba(255, 255, 255, 0.27) inset;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
.task:hover {
  background: #1b50b8;
  border-color: #082875;
}
.task.active {
  background: #1658dd;
  border-color: #082875;
  box-shadow: inset 2px 2px 4px rgba(0, 0, 0, 0.45);
}
.task .mini {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.task-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tray {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 0 10px 0 12px;
  color: #fff;
  font-size: 12px;
  border-left: 1px solid #000;
  box-shadow: 2px 0 3px #20e2fc inset;
  background-image: linear-gradient(
    0deg,
    #0a5bc6 0%,
    #1198e9 6%,
    #1198e9 63%,
    #1198e9 77%,
    #19b9f3 85%,
    #19b9f3 93%,
    #075dca 97%
  );
}
.tray-ico {
  width: 16px;
  height: 16px;
  object-fit: contain;
}
.tray-ico:last-of-type {
  cursor: pointer;
}
.tray-clock {
  margin-left: 2px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.4);
}
</style>
