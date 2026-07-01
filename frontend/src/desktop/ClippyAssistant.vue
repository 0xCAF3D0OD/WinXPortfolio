<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import agentData from './clippyAgent.json'

// Assistant « Clippy » animé via les données Microsoft Agent d'origine (sprite map
// unique + durée exacte de chaque frame + branches aléatoires) — approche reprise
// de Cyanoxide/react-xp, bien plus fluide qu'un PNG par frame. On garde nos astuces
// et actions propres au portfolio.
const emit = defineEmits<{ open: [string] }>()

interface Tip {
  text: string
  action?: { label: string; app: string }
}
const tips: Tip[] = [
  { text: 'On dirait que tu visites un portfolio ! Besoin d’un coup de main ?' },
  { text: 'Astuce : double-clique sur les icônes du bureau pour ouvrir les fenêtres.' },
  {
    text: 'Envie de jouer ? Tente le Démineur (réponds à un quiz pour survivre).',
    action: { label: 'Ouvrir le Démineur', app: 'game-minesweeper' },
  },
  {
    text: 'Curieux des projets de Kevin ? Ouvre Internet Explorer.',
    action: { label: 'Ouvrir Internet', app: 'iexplorer' },
  },
  {
    text: 'Psst… le terminal cache des commandes secrètes. Essaie « help ».',
    action: { label: 'Ouvrir le terminal', app: 'terminal' },
  },
  {
    text: 'Tu veux contacter Kevin ? Ouvre le formulaire (tu peux joindre un fichier).',
    action: { label: 'Me contacter', app: 'guestbook' },
  },
  {
    text: 'Découvre le blog de Kevin dans Windows Messenger.',
    action: { label: 'Ouvrir Windows Messenger', app: 'messenger' },
  },
  { text: 'Rejoins le Discord de Kevin via MSN.', action: { label: 'Ouvrir MSN', app: 'msn' } },
]

// --- Moteur d'animation (Microsoft Agent) ---
interface Frame {
  duration: number
  images?: number[][]
  branching?: { branches: { frameIndex: number; weight: number }[] }
}
interface Anim {
  frames: Frame[]
}
const agent = agentData as unknown as {
  framesize: [number, number]
  animations: Record<string, Anim>
}
const [FRAME_W, FRAME_H] = agent.framesize

// Animations calmes jouées pendant l'inactivité (filtrées sur celles réellement présentes).
const IDLE_ANIMATIONS = [
  'IdleAtom',
  'IdleFingerTap',
  'IdleHeadScratch',
  'IdleRopePile',
  'IdleSideToSide',
  'IdleSnooze',
  'Idle1_1',
  'LookUp',
  'LookDown',
  'LookLeft',
  'LookRight',
  'Searching',
  'CheckingSomething',
  'GetTechy',
  'GetArtsy',
  'GetWizardy',
  'Writing',
  'Print',
].filter((name) => agent.animations[name])

const MAX_STEPS = 200
const randomFrom = <T,>(pool: T[]) => pool[Math.floor(Math.random() * pool.length)]!

const framePos = ref<[number, number]>([0, 0])
const visible = ref(false)
const i = ref(0)

let showTimer: number | undefined
let animTimer: number | undefined
let idleTimer: number | undefined

function scheduleIdle() {
  if (idleTimer) clearTimeout(idleTimer)
  const delay = 4000 + Math.random() * 8000
  idleTimer = window.setTimeout(() => {
    if (IDLE_ANIMATIONS.length) playAnimation(randomFrom(IDLE_ANIMATIONS))
  }, delay)
}

// Joue une animation frame par frame avec la cadence et les branches d'origine.
function playAnimation(name: string) {
  const anim = agent.animations[name]
  if (!anim) return scheduleIdle()
  if (animTimer) clearTimeout(animTimer)
  if (idleTimer) clearTimeout(idleTimer)

  let frameIndex = 0
  let steps = 0

  const playFrame = () => {
    const frame = anim.frames[frameIndex]
    if (!frame) return scheduleIdle()
    if (frame.images?.[0]) framePos.value = frame.images[0] as [number, number]

    animTimer = window.setTimeout(() => {
      steps++
      let next = frameIndex + 1

      if (frame.branching && steps < MAX_STEPS) {
        let roll = Math.random() * 100
        for (const b of frame.branching.branches) {
          if (roll < b.weight) {
            next = b.frameIndex
            break
          }
          roll -= b.weight
        }
      }

      if (next >= anim.frames.length || steps >= MAX_STEPS) {
        framePos.value = [0, 0]
        scheduleIdle()
        return
      }
      frameIndex = next
      playFrame()
    }, frame.duration)
  }

  playFrame()
}

const spriteStyle = computed(() => ({
  width: FRAME_W + 'px',
  height: FRAME_H + 'px',
  backgroundPosition: `-${framePos.value[0]}px -${framePos.value[1]}px`,
}))

// --- Astuces / interactions ---
function appear() {
  i.value = Math.floor(Math.random() * tips.length)
  visible.value = true
  playAnimation('Greeting')
}
function next() {
  i.value = (i.value + 1) % tips.length
}
function onClippyClick() {
  next()
  playAnimation('GetAttention')
}
function dismiss() {
  visible.value = false
  if (animTimer) clearTimeout(animTimer)
  if (idleTimer) clearTimeout(idleTimer)
  clearTimeout(showTimer)
  showTimer = window.setTimeout(appear, 90000)
}
function doAction(app: string) {
  emit('open', app)
}

onMounted(() => {
  showTimer = window.setTimeout(appear, 9000)
})
onBeforeUnmount(() => {
  clearTimeout(showTimer)
  if (animTimer) clearTimeout(animTimer)
  if (idleTimer) clearTimeout(idleTimer)
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

    <div class="clippy" title="Clippy" @click="onClippyClick">
      <div class="sprite" :style="spriteStyle"></div>
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
  cursor: pointer;
  display: flex;
  justify-content: center;
}
.sprite {
  background-image: url('/xp/clippy/spritemap.png');
  background-repeat: no-repeat;
  filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.35));
}
</style>
