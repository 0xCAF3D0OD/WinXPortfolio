<script setup lang="ts">
import { ref, reactive, nextTick, onMounted } from 'vue'
import { execute, banner, commandNames, type Action } from '../terminal/commands'
import { profile } from '../portfolio'
import { applyTheme, loadTheme } from '../terminal/themes'

interface Block {
  input: string | null
  lines: string[]
}

const prompt = `${(profile.name.split(' ')[0] ?? 'user').toLowerCase()}@cloud`

// Bloc = une commande tapée + sa sortie. Le premier bloc (boot) se remplit progressivement.
const blocks = reactive<Block[]>([{ input: null, lines: [] }])
const current = ref('')
const booting = ref(true)
const history: string[] = []
let histIndex = -1

const inputEl = ref<HTMLInputElement | null>(null)
const screenEl = ref<HTMLElement | null>(null)

// --- Easter egg Matrix ---
const showMatrix = ref(false)
const matrixCanvas = ref<HTMLCanvasElement | null>(null)
let matrixRaf: number | null = null

function focusInput() {
  if (!booting.value && !showMatrix.value) inputEl.value?.focus()
}

async function scrollToBottom() {
  await nextTick()
  if (screenEl.value) screenEl.value.scrollTop = screenEl.value.scrollHeight
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

// Effet machine à écrire : on révèle la bannière ligne par ligne.
async function boot() {
  for (const line of banner) {
    blocks[0]!.lines.push(line)
    scrollToBottom()
    await sleep(line.trim() ? 55 : 25)
  }
  booting.value = false
  await nextTick()
  focusInput()
}

function handleAction(action?: Action) {
  if (!action) return
  if (action.type === 'theme') applyTheme(action.name)
  if (action.type === 'matrix') startMatrix()
}

function submit() {
  if (booting.value) return
  const value = current.value
  const { lines, clear, action } = execute(value)
  if (value.trim()) {
    history.push(value)
    histIndex = history.length
  }
  if (clear) blocks.splice(0, blocks.length)
  else blocks.push({ input: value, lines })
  current.value = ''
  handleAction(action)
  scrollToBottom()
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (histIndex > 0) histIndex--
    current.value = history[histIndex] ?? current.value
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (histIndex < history.length - 1) {
      histIndex++
      current.value = history[histIndex] ?? ''
    } else {
      histIndex = history.length
      current.value = ''
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const typed = current.value.trim().toLowerCase()
    if (!typed) return
    const match = commandNames.filter((c) => c.startsWith(typed))
    if (match.length === 1) current.value = match[0] ?? current.value
    else if (match.length > 1) {
      blocks.push({ input: current.value, lines: [match.join('  ')] })
      scrollToBottom()
    }
  } else if (e.key === 'l' && e.ctrlKey) {
    e.preventDefault()
    blocks.splice(0, blocks.length)
  }
}

function startMatrix() {
  showMatrix.value = true
  nextTick(() => {
    const canvas = matrixCanvas.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops = new Array(columns).fill(1)
    const chars = 'アイウエオカキクケコ0123456789ABCDEFΨΩ$#@'
    function draw() {
      if (!ctx) return
      ctx.fillStyle = 'rgba(0, 8, 0, 0.08)'
      ctx.fillRect(0, 0, canvas!.width, canvas!.height)
      ctx.fillStyle = '#39ff14'
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)] ?? '0'
        ctx.fillText(text, i * fontSize, drops[i]! * fontSize)
        if (drops[i]! * fontSize > canvas!.height && Math.random() > 0.975) drops[i] = 0
        drops[i]!++
      }
      matrixRaf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('keydown', stopMatrix, { once: true })
  })
}

function stopMatrix() {
  if (matrixRaf) cancelAnimationFrame(matrixRaf)
  matrixRaf = null
  showMatrix.value = false
  nextTick(focusInput)
}

onMounted(() => {
  loadTheme()
  boot()
})
</script>

<template>
  <main class="window" @click="focusInput">
    <div class="screen" ref="screenEl">
      <div v-for="(block, i) in blocks" :key="i" class="block">
        <div v-if="block.input !== null" class="cmd-line">
          <span class="prompt">{{ prompt }}</span
          ><span class="sep">:</span><span class="path">~</span><span class="dollar">$</span>
          <span class="typed">{{ block.input }}</span>
        </div>
        <div v-for="(line, j) in block.lines" :key="j" class="out" v-html="line || '&nbsp;'"></div>
      </div>

      <div v-if="!booting" class="cmd-line input-line">
        <span class="prompt">{{ prompt }}</span
        ><span class="sep">:</span><span class="path">~</span><span class="dollar">$</span>
        <input
          ref="inputEl"
          v-model="current"
          class="input"
          spellcheck="false"
          autocomplete="off"
          autocapitalize="off"
          aria-label="Saisie de commande"
          @keydown="onKeydown"
          @keyup.enter="submit"
        />
      </div>
      <div v-else class="cmd-line">
        <span class="prompt">{{ prompt }}</span
        ><span class="sep">:</span><span class="path">~</span><span class="dollar">$</span>
        <span class="cursor"></span>
      </div>
    </div>

    <div v-if="showMatrix" class="matrix-overlay" @click="stopMatrix">
      <canvas ref="matrixCanvas"></canvas>
    </div>
  </main>
</template>

<style scoped>
.window {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg);
  overflow: hidden;
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

.screen {
  flex: 1;
  overflow-y: auto;
  padding: 16px 18px 22px;
  font-size: 14px;
  line-height: 1.65;
  color: var(--fg);
}

.block {
  margin-bottom: 2px;
}

.cmd-line {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  white-space: pre;
}
.prompt {
  color: var(--prompt);
}
.sep {
  color: var(--fg);
}
.path {
  color: var(--path);
}
.dollar {
  color: var(--fg);
  margin: 0 8px 0 2px;
}
.typed {
  color: #e6edf3;
  white-space: pre-wrap;
}

.out {
  white-space: pre-wrap;
  word-break: break-word;
}

.input-line {
  margin-top: 2px;
}
.input {
  flex: 1;
  min-width: 60px;
  background: transparent;
  border: none;
  outline: none;
  color: #e6edf3;
  font: inherit;
  caret-color: var(--accent);
  padding: 0;
}

.dim {
  color: var(--dim);
}
.accent {
  color: var(--accent);
}
.ok {
  color: var(--ok);
}
.err {
  color: var(--err);
}
.banner {
  color: var(--banner);
  font-size: 12px;
  line-height: 1.3;
}
.dir {
  color: var(--accent);
}
.file {
  color: var(--link);
}

.out :deep(a) {
  color: var(--link);
  text-decoration: none;
  border-bottom: 1px dotted currentColor;
}
.out :deep(a:hover) {
  color: #a5d6ff;
}

.screen::-webkit-scrollbar {
  width: 10px;
}
.screen::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
}

.cursor {
  display: inline-block;
  width: 9px;
  height: 16px;
  background: var(--accent);
  vertical-align: -3px;
  animation: blink 1s steps(2) infinite;
}
@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

.matrix-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #000;
  cursor: pointer;
}
.matrix-overlay canvas {
  display: block;
}

@media (max-width: 640px) {
  .banner {
    font-size: 9px;
  }
}
</style>
