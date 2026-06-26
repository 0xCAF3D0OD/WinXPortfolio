<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount, nextTick, provide } from 'vue'
import { apps, type AppDef } from './registry'
import { useWindows, type WinState } from './useWindows'
import { muted, playSound } from './sound'
import XpWindow from './XpWindow.vue'
import StartMenu from './StartMenu.vue'
import ClippyAssistant from './ClippyAssistant.vue'
import ErrorDialog from './ErrorDialog.vue'
import TrayBalloon from './TrayBalloon.vue'
import WebampHost from './WebampHost.vue'

const emit = defineEmits<{ logoff: [] }>()
const { windows, open, taskbarToggle, reset } = useWindows()

// Winamp (Webamp) est monté directement sur le bureau (pas une fenêtre XP) :
// déplaçable / redimensionnable librement comme sur winamp.org.
const webampOpen = ref(false)

const selected = ref<string | null>(null)
const startOpen = ref(false)
const clock = ref('')

function toggleMute() {
  muted.value = !muted.value
}

function openApp(app: AppDef) {
  startOpen.value = false
  if (app.id === 'webamp') {
    webampOpen.value = true
    return
  }
  open(app)
}

// Popup d'erreur « Application not found » pour les apps non implémentées.
const errorMsg = ref<string | null>(null)
function showError(message = 'C:\\\nApplication not found') {
  errorMsg.value = message
  playSound('error')
}
provide('showError', showError)

function openById(id: string) {
  if (id === 'webamp') {
    webampOpen.value = true
    return
  }
  const app = apps.find((a) => a.id === id)
  if (app) open(app)
  else showError()
}
// Permet aux apps (MSN, etc.) d'en ouvrir d'autres.
provide('openApp', openById)
// Permet au lanceur de jeux d'ouvrir une fenêtre dynamique (jeu non listé dans apps).
provide('openWindow', (def: AppDef) => open(def))
// Apps volontairement absentes du bureau (restent accessibles via le menu
// Démarrer) — pour garder le bureau centré sur l'essentiel « qui je suis ».
const HIDDEN_DESKTOP = new Set([
  'game-pinball',
  'game-solitaire',
  'game-hearts',
  'help',
  'game-morpion',
  'contact',
  'msn',
  'messenger',
  'welcome',
  'webamp',
  // 'controlpanel',
])
const desktopApps = computed(() => apps.filter((a) => !HIDDEN_DESKTOP.has(a.id)))

// --- Icônes du bureau : disposition en groupes + déplacement (persisté) ---
// Chaque sous-tableau = une colonne thématique.
const iconGroups: string[][] = [
  ['terminal', 'iexplorer'], // profil & compétences
  ['about', 'cv-fr', 'cv-en'],
  ['controlpanel', 'projects'], // documents PDF
  ['guestbook'], // me contacter
  ['game-minesweeper', 'bin'], // jeux & annexes
]
const X0 = 14
const Y0 = 12
const COL_W = 92
const ROW_H = 80
const LS_KEY = 'desktop-icons-v2'
const iconPos = reactive<Record<string, { x: number; y: number }>>({})

function defaultLayout(): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {}
  const placed = new Set<string>()
  iconGroups.forEach((g, gi) => {
    let ri = 0
    g.forEach((id) => {
      if (desktopApps.value.some((a) => a.id === id)) {
        pos[id] = {
          x: X0 + ri * ROW_H,
          y: Y0 + gi * 2 * COL_W,
        }
        placed.add(id)
        ri++
      }
    })
  })
  let extra = 0
  desktopApps.value.forEach((a) => {
    if (!placed.has(a.id)) {
      pos[a.id] = {
        x: X0 + iconGroups.length * COL_W,
        y: Y0 + extra * ROW_H,
      }
      extra++
    }
  })
  return pos
}
function loadLayout() {
  let saved: Record<string, { x: number; y: number }> = {}
  try {
    saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}')
  } catch {
    saved = {}
  }
  const def = defaultLayout()
  desktopApps.value.forEach((a) => {
    iconPos[a.id] = saved[a.id] || def[a.id] || { x: X0, y: Y0 }
  })
}
function saveLayout() {
  localStorage.setItem(LS_KEY, JSON.stringify(iconPos))
}

let dragId: string | null = null
let dStartX = 0
let dStartY = 0
let dOrigX = 0
let dOrigY = 0
let dragged = false
function iconPointerDown(e: PointerEvent, id: string) {
  selected.value = id
  dragId = id
  dragged = false
  dStartX = e.clientX
  dStartY = e.clientY
  dOrigX = iconPos[id]?.x ?? X0
  dOrigY = iconPos[id]?.y ?? Y0
  window.addEventListener('pointermove', iconPointerMove)
  window.addEventListener('pointerup', iconPointerUp)
}
function iconPointerMove(e: PointerEvent) {
  if (!dragId) return
  const dx = e.clientX - dStartX
  const dy = e.clientY - dStartY
  if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragged = true
  iconPos[dragId] = { x: Math.max(0, dOrigX + dx), y: Math.max(0, dOrigY + dy) }
}
function iconPointerUp() {
  if (dragId && dragged) {
    // Alignement sur la grille au lâcher.
    const p = iconPos[dragId]
    if (p) {
      p.x = X0 + Math.max(0, Math.round((p.x - X0) / COL_W)) * COL_W
      p.y = Y0 + Math.max(0, Math.round((p.y - Y0) / ROW_H)) * ROW_H
    }
    saveLayout()
  }
  dragId = null
  window.removeEventListener('pointermove', iconPointerMove)
  window.removeEventListener('pointerup', iconPointerUp)
}

// --- Économiseur d'écran (logo windoors rebondissant après inactivité) ---
const screensaver = ref(false)
const ssCanvas = ref<HTMLCanvasElement | null>(null)
let idleTimer: number
let ssRaf: number | null = null
const IDLE_MS = 60000

function resetIdle() {
  if (screensaver.value) stopScreensaver()
  clearTimeout(idleTimer)
  idleTimer = window.setTimeout(startScreensaver, IDLE_MS)
}

// Les jeux (Pinball…) tournent dans une iframe : les événements souris/clavier
// restent à l'intérieur et n'atteignent jamais `window`, donc l'économiseur se
// déclencherait en pleine partie. On écoute aussi l'activité dans les iframes de
// même origine pour réinitialiser l'inactivité tant que l'on joue.
const attachedFrames = new WeakSet<HTMLIFrameElement>()
function attachFrameActivity() {
  document.querySelectorAll<HTMLIFrameElement>('.area iframe').forEach((frame) => {
    if (attachedFrames.has(frame)) return
    attachedFrames.add(frame)
    const attach = () => {
      try {
        const doc = frame.contentDocument
        if (!doc) return
        activityEvents.forEach((e) => doc.addEventListener(e, resetIdle, { passive: true }))
      } catch {
        /* iframe d'une autre origine : impossible d'écouter, on ignore */
      }
    }
    attach() // si déjà chargée
    frame.addEventListener('load', attach) // et à chaque (re)chargement
  })
}
let frameObserver: MutationObserver | null = null

function startScreensaver() {
  screensaver.value = true
  nextTick(() => {
    const canvas = ssCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const img = new Image()
    img.src = '/xp/windoors-2.svg'
    const w = 150
    const h = 136
    let x = Math.random() * (canvas.width - w)
    let y = Math.random() * (canvas.height - h)
    let dx = 1.6
    let dy = 1.3
    function frame() {
      if (!ctx) return
      ctx.fillStyle = '#000'
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)
      x += dx
      y += dy
      if (x <= 0 || x + w >= canvas!.width) dx = -dx
      if (y <= 0 || y + h >= canvas!.height) dy = -dy
      if (img.complete) ctx.drawImage(img, x, y, w, h)
      ssRaf = requestAnimationFrame(frame)
    }
    frame()
  })
}

function stopScreensaver() {
  if (ssRaf) cancelAnimationFrame(ssRaf)
  ssRaf = null
  screensaver.value = false
}

function logoff() {
  startOpen.value = false
  reset()
  emit('logoff')
}

function tick() {
  clock.value = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}
// Centre une fenêtre dans la zone du bureau et la borne pour qu'elle tienne à
// l'écran (évite le débordement des grandes fenêtres et le scroll horizontal).
function placeCentered(w: WinState, dx = 0, dy = 0) {
  const area = document.querySelector('.area') as HTMLElement | null
  const cw = area?.clientWidth ?? window.innerWidth
  const ch = area?.clientHeight ?? window.innerHeight
  w.w = Math.min(w.w, cw - 32)
  w.h = Math.min(w.h, ch - 32)
  w.x = Math.max(12, Math.round((cw - w.w) / 2) + dx)
  w.y = Math.max(12, Math.round((ch - w.h) / 2) + dy)
}

let timer: number
const activityEvents = ['pointermove', 'pointerdown', 'keydown', 'wheel'] as const
onMounted(() => {
  loadLayout()
  tick()
  timer = window.setInterval(tick, 1000 * 20)
  // Fenêtres d'ouverture, centrées et bornées à l'écran (pas de débordement) :
  // terminal pour donner le ton, IExplorer (bio WikiDK), et l'accueil au-dessus.
  const term = apps.find((a) => a.id === 'terminal')
  const iexplorer = apps.find((a) => a.id === 'iexplorer')
  const welcome = apps.find((a) => a.id === 'welcome')
  if (term) placeCentered(open(term), -28, -22)
  if (iexplorer) placeCentered(open(iexplorer))
  // « Mise en route » : raccourci rapide vers l'essentiel, au premier plan.
  if (welcome) {
    const w = open(welcome)
    placeCentered(w, 0, -8)
    // Re-centre une fois le layout stabilisé (sécurité).
    requestAnimationFrame(() => placeCentered(w, 0, -8))
  }
  activityEvents.forEach((e) => window.addEventListener(e, resetIdle))
  // Surveille l'apparition d'iframes (fenêtres de jeu) pour y brancher l'activité.
  const area = document.querySelector('.area')
  if (area) {
    frameObserver = new MutationObserver(() => attachFrameActivity())
    frameObserver.observe(area, { childList: true, subtree: true })
  }
  attachFrameActivity()
  resetIdle()
})
onBeforeUnmount(() => {
  clearInterval(timer)
  clearTimeout(idleTimer)
  if (ssRaf) cancelAnimationFrame(ssRaf)
  activityEvents.forEach((e) => window.removeEventListener(e, resetIdle))
  frameObserver?.disconnect()
})

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
          v-for="app in desktopApps"
          :key="app.id"
          class="desk-icon"
          :class="{ selected: selected === app.id }"
          :style="{
            left: (iconPos[app.id]?.x ?? 14) + 'px',
            top: (iconPos[app.id]?.y ?? 12) + 'px',
          }"
          @pointerdown.stop="iconPointerDown($event, app.id)"
          @dblclick="openApp(app)"
        >
          <img class="glyph" :src="app.icon" alt="" draggable="false" />
          <span class="label">{{ app.label }}</span>
        </button>
      </div>

      <!-- Fenêtres -->
      <XpWindow v-for="win in windows" :key="win.id" :win="win" />

      <!-- Winamp : monté à même le bureau (déplaçable / redimensionnable partout) -->
      <WebampHost v-if="webampOpen" @close="webampOpen = false" />
    </div>

    <!-- Menu Démarrer -->
    <StartMenu v-if="startOpen" @open="openApp" @logoff="logoff" @close="startOpen = false" />

    <!-- Popup d'erreur « Application not found » -->
    <ErrorDialog v-if="errorMsg" :message="errorMsg" @close="errorMsg = null" />

    <!-- Barre des tâches -->
    <div class="taskbar">
      <button
        class="start-btn"
        :class="{ active: startOpen }"
        @pointerdown.stop="startOpen = !startOpen"
      >
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
          @click="toggleMute"
        />
        <img
          class="tray-ico tray-risk"
          src="/xp/windowsIcons/229(16x16).png"
          alt="Alerte de sécurité"
          title="Alerte de sécurité"
        />
        <span class="tray-clock">{{ clock }}</span>
      </div>

      <!-- Bulle de notification façon XP, au-dessus de la zone de notification -->
      <TrayBalloon />
    </div>

    <!-- Assistant -->
    <ClippyAssistant @open="openById" />

    <!-- Économiseur d'écran -->
    <div v-if="screensaver" class="screensaver">
      <canvas ref="ssCanvas"></canvas>
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
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.desk-icon {
  position: absolute;
  pointer-events: auto;
  width: 80px;
  background: transparent;
  border: 1px dotted transparent;
  padding: 6px 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: default;
  color: #fff;
  touch-action: none;
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

.screensaver {
  position: fixed;
  inset: 0;
  z-index: 100001;
  background: #000;
  cursor: none;
}
.screensaver canvas {
  display: block;
}
</style>
