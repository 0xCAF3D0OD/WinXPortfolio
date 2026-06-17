<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{ open: [string] }>()

interface Tip {
  text: string
  action?: { label: string; app: string }
}
const tips: Tip[] = [
  { text: 'On dirait que tu visites un portfolio ! Besoin d’un coup de main ?' },
  { text: 'Astuce : double-clique sur les icônes du bureau pour ouvrir les fenêtres.' },
  { text: 'Envie de jouer ? Tente le Démineur (réponds à un quiz pour survivre).', action: { label: 'Ouvrir le Démineur', app: 'game-minesweeper' } },
  { text: 'Curieux des projets de Kevin ? Ouvre Internet Explorer.', action: { label: 'Ouvrir Internet', app: 'iexplorer' } },
  { text: 'Psst… le terminal cache des commandes secrètes. Essaie « help ».', action: { label: 'Ouvrir le terminal', app: 'terminal' } },
  { text: 'Tu veux contacter Kevin ? Ouvre le formulaire (tu peux joindre un fichier).', action: { label: 'Me contacter', app: 'guestbook' } },
  { text: 'Tu peux me retrouver sur MSN Messenger 😉', action: { label: 'Ouvrir MSN', app: 'msn' } },
]

const seq = (dir: string, count: number) =>
  Array.from({ length: count }, (_, i) => `/xp/clippy/${dir}/${String(i + 1).padStart(2, '0')}.png`)

const idle = seq('idle', 22)
const greet = seq('greet', 19)
const gestures = [seq('gest1', 4), seq('gest2', 22), seq('gest3', 22)]

const FRAME_MS = 180 // cadence d'animation (plus lent qu'avant)

const frame = ref(idle[0]!)
const visible = ref(false)
const i = ref(0)
let showTimer: number
let animTimer: number | null = null
let gestureTimer: number | null = null

function preload(list: string[]) {
  list.forEach((src) => {
    const im = new Image()
    im.src = src
  })
}

function play(frames: string[], loop: boolean, done?: () => void) {
  if (animTimer) clearInterval(animTimer)
  let f = 0
  frame.value = frames[0]!
  animTimer = window.setInterval(() => {
    f++
    if (f >= frames.length) {
      if (loop) f = 0
      else {
        if (animTimer) clearInterval(animTimer)
        animTimer = null
        done?.()
        return
      }
    }
    frame.value = frames[f]!
  }, FRAME_MS)
}

// Idle en boucle, avec un geste aléatoire toutes les ~11 s.
function startIdle() {
  play(idle, true)
  if (gestureTimer) clearTimeout(gestureTimer)
  gestureTimer = window.setTimeout(playGesture, 9000 + Math.random() * 5000)
}
function playGesture() {
  const g = gestures[Math.floor(Math.random() * gestures.length)]!
  play(g, false, startIdle)
}

function appear() {
  i.value = Math.floor(Math.random() * tips.length)
  visible.value = true
  play(greet, false, startIdle)
}
function next() {
  i.value = (i.value + 1) % tips.length
}
function dismiss() {
  visible.value = false
  if (animTimer) clearInterval(animTimer)
  animTimer = null
  if (gestureTimer) clearTimeout(gestureTimer)
  gestureTimer = null
  clearTimeout(showTimer)
  showTimer = window.setTimeout(appear, 90000)
}
function doAction(app: string) {
  // On ouvre l'app mais Clippy reste à l'écran (il ne disparaît que via ×).
  emit('open', app)
}

onMounted(() => {
  preload(idle)
  preload(greet)
  showTimer = window.setTimeout(appear, 9000)
})
onBeforeUnmount(() => {
  clearTimeout(showTimer)
  if (animTimer) clearInterval(animTimer)
  if (gestureTimer) clearTimeout(gestureTimer)
})
</script>

<template>
  <div v-if="visible" class="assistant">
    <div class="bubble">
      <button class="x" aria-label="Fermer" @click="dismiss">×</button>
      <p>{{ tips[i]!.text }}</p>
      <div class="actions">
        <button v-if="tips[i]!.action" class="link" @click="doAction(tips[i]!.action!.app)">
          {{ tips[i]!.action!.label }}
        </button>
        <button class="link" @click="next">Une autre astuce →</button>
      </div>
    </div>

    <div class="clippy" @click="next">
      <img :src="frame" alt="Assistant" draggable="false" />
    </div>
  </div>
</template>

<style scoped>
.assistant {
  position: fixed;
  right: 18px;
  bottom: 38px;
  z-index: 9990;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  font-family: Tahoma, sans-serif;
}
.bubble {
  position: relative;
  max-width: 232px;
  background: #ffffe1;
  border: 1px solid #8d8d6b;
  border-radius: 8px;
  padding: 10px 12px 8px;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
  font-size: 12px;
  color: #222;
}
.bubble::after {
  content: '';
  position: absolute;
  right: 40px;
  bottom: -9px;
  width: 14px;
  height: 14px;
  background: #ffffe1;
  border-right: 1px solid #8d8d6b;
  border-bottom: 1px solid #8d8d6b;
  transform: rotate(45deg);
}
.bubble p {
  margin: 0 0 6px;
  line-height: 1.4;
}
.x {
  position: absolute;
  top: 3px;
  right: 5px;
  border: none;
  background: transparent;
  font-size: 15px;
  line-height: 1;
  color: #777;
  cursor: pointer;
}
.actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.link {
  border: none;
  background: transparent;
  color: #0b57d0;
  text-decoration: underline;
  font-size: 12px;
  text-align: left;
  padding: 1px 0;
  cursor: pointer;
}
.clippy {
  width: 100px;
  height: 96px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  cursor: pointer;
}
.clippy img {
  max-width: 100%;
  max-height: 96px;
  filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.35));
}
</style>
