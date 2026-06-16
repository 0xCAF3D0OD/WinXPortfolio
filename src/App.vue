<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { execute, banner, commandNames } from './commands.js'
import { profile } from './portfolio.js'
import { applyTheme, loadTheme } from './themes.js'

const prompt = `${profile.name.split(' ')[0].toLowerCase()}@cloud`

// Bloc = une commande tapée + sa sortie. Le premier bloc (boot) se remplit progressivement.
const blocks = reactive([{ input: null, lines: [] }])
const current = ref('')
const booting = ref(true)
const history = []
let histIndex = -1

const inputEl = ref(null)
const screenEl = ref(null)

// --- Easter egg Matrix ---
const showMatrix = ref(false)
const matrixCanvas = ref(null)
let matrixRaf = null

function focusInput() {
  if (!booting.value && !showMatrix.value) inputEl.value?.focus()
}

async function scrollToBottom() {
  await nextTick()
  if (screenEl.value) screenEl.value.scrollTop = screenEl.value.scrollHeight
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Effet machine à écrire : on révèle la bannière ligne par ligne.
async function boot() {
  for (const line of banner) {
    blocks[0].lines.push(line)
    scrollToBottom()
    await sleep(line.trim() ? 55 : 25)
  }
  booting.value = false
  await nextTick()
  focusInput()
}

function handleAction(action) {
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

function onKeydown(e) {
  if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (histIndex > 0) histIndex--
    current.value = history[histIndex] ?? current.value
  } else if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (histIndex < history.length - 1) {
      histIndex++
      current.value = history[histIndex]
    } else {
      histIndex = history.length
      current.value = ''
    }
  } else if (e.key === 'Tab') {
    e.preventDefault()
    const typed = current.value.trim().toLowerCase()
    if (!typed) return
    const match = commandNames.filter((c) => c.startsWith(typed))
    if (match.length === 1) current.value = match[0]
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
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops = new Array(columns).fill(1)
    const chars = 'アイウエオカキクケコ0123456789ABCDEFΨΩ$#@'
    function draw() {
      ctx.fillStyle = 'rgba(0, 8, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#39ff14'
      ctx.font = `${fontSize}px monospace`
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
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
    <header class="titlebar">
      <span class="dot red"></span>
      <span class="dot yellow"></span>
      <span class="dot green"></span>
      <span class="title">{{ prompt }}: ~</span>
    </header>

    <div class="screen" ref="screenEl">
      <div v-for="(block, i) in blocks" :key="i" class="block">
        <div v-if="block.input !== null" class="cmd-line">
          <span class="prompt">{{ prompt }}</span><span class="sep">:</span><span class="path">~</span><span class="dollar">$</span>
          <span class="typed">{{ block.input }}</span>
        </div>
        <div v-for="(line, j) in block.lines" :key="j" class="out" v-html="line || '&nbsp;'"></div>
      </div>

      <div v-if="!booting" class="cmd-line input-line">
        <span class="prompt">{{ prompt }}</span><span class="sep">:</span><span class="path">~</span><span class="dollar">$</span>
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
        <span class="prompt">{{ prompt }}</span><span class="sep">:</span><span class="path">~</span><span class="dollar">$</span>
        <span class="cursor"></span>
      </div>
    </div>

    <div v-if="showMatrix" class="matrix-overlay" @click="stopMatrix">
      <canvas ref="matrixCanvas"></canvas>
    </div>
  </main>
</template>

<style scoped>
.cursor {
  display: inline-block;
  width: 9px;
  height: 16px;
  background: var(--accent);
  vertical-align: -3px;
  animation: blink 1s steps(2) infinite;
}
@keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0 } }
.matrix-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: #000;
  cursor: pointer;
}
.matrix-overlay canvas { display: block; }
</style>
