<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Assistant original « Trombi » (trombone à yeux) — pas l'artwork Microsoft.
const emit = defineEmits<{ open: [string] }>()

interface Tip {
  text: string
  action?: { label: string; app: string }
}
const tips: Tip[] = [
  { text: 'On dirait que tu visites un portfolio ! Besoin d’un coup de main ?' },
  { text: 'Astuce : double-clique sur les icônes du bureau pour ouvrir les fenêtres.' },
  { text: 'Envie de jouer ? Je peux lancer le Démineur.', action: { label: 'Ouvrir le Démineur', app: 'minesweeper' } },
  { text: 'Curieux des projets de Kevin ? Ouvre Internet Explorer.', action: { label: 'Ouvrir Internet', app: 'iexplorer' } },
  { text: 'Psst… le terminal cache quelques commandes secrètes. Essaie « help ».', action: { label: 'Ouvrir le terminal', app: 'terminal' } },
  { text: 'Laisse un petit mot à Kevin dans le Livre d’or !', action: { label: 'Ouvrir le Livre d’or', app: 'guestbook' } },
]

const visible = ref(false)
const i = ref(0)
let showTimer: number

function appear() {
  i.value = Math.floor(Math.random() * tips.length)
  visible.value = true
}
function next() {
  i.value = (i.value + 1) % tips.length
}
function dismiss() {
  visible.value = false
  clearTimeout(showTimer)
  // revient plus tard
  showTimer = window.setTimeout(appear, 90000)
}
function doAction(app: string) {
  emit('open', app)
  dismiss()
}

onMounted(() => {
  showTimer = window.setTimeout(appear, 12000)
})
onBeforeUnmount(() => {
  clearTimeout(showTimer)
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

    <svg class="trombi" viewBox="0 0 80 110" @click="next" role="img" aria-label="Assistant">
      <g fill="none" stroke="#9aa6b2" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
        <path d="M28 96 V40 a16 16 0 0 1 32 0 V78 a9 9 0 0 1 -18 0 V46" />
        <path d="M20 90 V36 a24 24 0 0 1 48 0 V80" stroke="#c2ccd6" />
      </g>
      <circle cx="34" cy="30" r="9" fill="#fff" stroke="#5a6675" stroke-width="2" />
      <circle cx="52" cy="30" r="9" fill="#fff" stroke="#5a6675" stroke-width="2" />
      <circle cx="36" cy="32" r="3.5" fill="#222" />
      <circle cx="54" cy="32" r="3.5" fill="#222" />
    </svg>
  </div>
</template>

<style scoped>
.assistant {
  position: fixed;
  right: 18px;
  bottom: 42px;
  z-index: 9990;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
  font-family: Tahoma, sans-serif;
}
.bubble {
  position: relative;
  max-width: 230px;
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
  right: 26px;
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
.trombi {
  width: 64px;
  height: 88px;
  cursor: pointer;
  filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.35));
  animation: bob 3s ease-in-out infinite;
}
@keyframes bob {
  50% {
    transform: translateY(-5px) rotate(-3deg);
  }
}
</style>
