<script setup lang="ts">
import { ref, reactive, computed, onBeforeUnmount } from 'vue'

const ROWS = 9
const COLS = 9
const MINES = 10

interface Cell {
  mine: boolean
  revealed: boolean
  flagged: boolean
  adj: number
}

const grid = reactive<Cell[][]>([])
const state = ref<'ready' | 'playing' | 'won' | 'lost'>('ready')
const flags = ref(0)
const time = ref(0)
let timer: number | null = null
let placed = false

// --- Quiz « connais-tu Kevin ? » : une bonne réponse = une vie (absorbe une mine) ---
const lives = ref(0)
const quiz = [
  {
    q: 'Chez quelle entreprise Kevin a-t-il fait son stage DevOps ?',
    opts: ['NAGRA Kudelski', 'Google', 'OVHcloud'],
    a: 0,
  },
  {
    q: 'Quel projet de Kevin tourne en production ?',
    opts: ['alloremplacant.ch', 'monsite.fr', 'example.com'],
    a: 0,
  },
  {
    q: 'Quel outil d’Infrastructure as Code Kevin utilise-t-il ?',
    opts: ['Photoshop', 'Terraform', 'Excel'],
    a: 1,
  },
  {
    q: 'Dans quel pays Kevin travaille-t-il ?',
    opts: ['Canada', 'Japon', 'Suisse'],
    a: 2,
  },
  {
    q: 'Quel orchestrateur de conteneurs Kevin maîtrise-t-il ?',
    opts: ['Kubernetes', 'WordPress', 'MySQL'],
    a: 0,
  },
]
const qIndex = ref(Math.floor(Math.random() * quiz.length))
const quizMsg = ref('')

function answer(i: number) {
  if (i === quiz[qIndex.value]!.a) {
    lives.value++
    quizMsg.value = '✓ Bonne réponse ! +1 vie.'
  } else {
    quizMsg.value = '✗ Raté… la bonne réponse t’en apprend plus sur Kevin.'
  }
  window.setTimeout(() => {
    quizMsg.value = ''
    qIndex.value = (qIndex.value + 1) % quiz.length
  }, 1600)
}

function blank(): Cell {
  return { mine: false, revealed: false, flagged: false, adj: 0 }
}

function reset() {
  grid.splice(0, grid.length)
  for (let r = 0; r < ROWS; r++) grid.push(Array.from({ length: COLS }, blank))
  state.value = 'ready'
  flags.value = 0
  time.value = 0
  placed = false
  if (timer) clearInterval(timer)
  timer = null
}

function startTimer() {
  timer = window.setInterval(() => {
    if (time.value < 999) time.value++
  }, 1000)
}

function placeMines(safeR: number, safeC: number) {
  let toPlace = MINES
  while (toPlace > 0) {
    const r = Math.floor(Math.random() * ROWS)
    const c = Math.floor(Math.random() * COLS)
    if (grid[r]![c]!.mine) continue
    if (Math.abs(r - safeR) <= 1 && Math.abs(c - safeC) <= 1) continue
    grid[r]![c]!.mine = true
    toPlace--
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (grid[r]![c]!.mine) continue
      grid[r]![c]!.adj = neighbors(r, c).filter(([nr, nc]) => grid[nr]![nc]!.mine).length
    }
  }
  placed = true
}

function neighbors(r: number, c: number): [number, number][] {
  const out: [number, number][] = []
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (dr === 0 && dc === 0) continue
      const nr = r + dr
      const nc = c + dc
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) out.push([nr, nc])
    }
  return out
}

function reveal(r: number, c: number) {
  if (state.value === 'won' || state.value === 'lost') return
  const cell = grid[r]![c]!
  if (cell.revealed || cell.flagged) return
  if (!placed) {
    placeMines(r, c)
    state.value = 'playing'
    startTimer()
  }
  if (cell.mine) {
    if (lives.value > 0) {
      // Une vie absorbe la mine : on la désamorce (drapeau) et on continue.
      lives.value--
      cell.flagged = true
      flags.value++
      quizMsg.value = '💥 Mine désamorcée grâce à une vie !'
      window.setTimeout(() => (quizMsg.value = ''), 1600)
      checkWin()
      return
    }
    cell.revealed = true
    lose()
    return
  }
  flood(r, c)
  checkWin()
}

function flood(r: number, c: number) {
  const cell = grid[r]![c]!
  if (cell.revealed || cell.flagged || cell.mine) return
  cell.revealed = true
  if (cell.adj === 0) neighbors(r, c).forEach(([nr, nc]) => flood(nr, nc))
}

function toggleFlag(r: number, c: number) {
  if (state.value === 'won' || state.value === 'lost') return
  const cell = grid[r]![c]!
  if (cell.revealed) return
  cell.flagged = !cell.flagged
  flags.value += cell.flagged ? 1 : -1
}

function lose() {
  state.value = 'lost'
  if (timer) clearInterval(timer)
  for (const row of grid) for (const cell of row) if (cell.mine) cell.revealed = true
}

function checkWin() {
  let safeHidden = 0
  for (const row of grid) for (const cell of row) if (!cell.mine && !cell.revealed) safeHidden++
  if (safeHidden === 0) {
    state.value = 'won'
    if (timer) clearInterval(timer)
  }
}

const face = computed(() =>
  state.value === 'lost' ? '😵' : state.value === 'won' ? '😎' : '🙂',
)
const minesLeft = computed(() => Math.max(0, MINES - flags.value))
const pad = (n: number) => n.toString().padStart(3, '0')
const numColor = ['', '#0000ff', '#008000', '#ff0000', '#000080', '#800000', '#008080', '#000', '#808080']

reset()
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="ms" @contextmenu.prevent>
    <div class="panel">
      <div class="led">{{ pad(minesLeft) }}</div>
      <button class="face" @click="reset">{{ face }}</button>
      <div class="led">{{ pad(time) }}</div>
    </div>
    <div class="lives">Vies : <span v-if="lives">{{ '♥'.repeat(lives) }}</span><span v-else class="none">aucune</span></div>
    <div class="board" :style="{ gridTemplateColumns: `repeat(${COLS}, 22px)` }">
      <template v-for="(row, r) in grid" :key="r">
        <button
          v-for="(cell, c) in row"
          :key="r + '-' + c"
          class="cell"
          :class="{ revealed: cell.revealed, mine: cell.revealed && cell.mine }"
          @click="reveal(r, c)"
          @contextmenu.prevent="toggleFlag(r, c)"
        >
          <template v-if="cell.revealed">
            <span v-if="cell.mine">💣</span>
            <span v-else-if="cell.adj > 0" :style="{ color: numColor[cell.adj] }">{{ cell.adj }}</span>
          </template>
          <span v-else-if="cell.flagged">🚩</span>
        </button>
      </template>
    </div>
    <p class="hint">Clic gauche : révéler · Clic droit : drapeau</p>

    <div class="quiz">
      <p class="qtitle">Connais-tu Kevin ? <span class="reward">(bonne réponse = +1 vie)</span></p>
      <p class="q">{{ quiz[qIndex]!.q }}</p>
      <div class="opts">
        <button v-for="(o, i) in quiz[qIndex]!.opts" :key="i" @click="answer(i)">{{ o }}</button>
      </div>
      <p v-if="quizMsg" class="qmsg">{{ quizMsg }}</p>
    </div>
  </div>
</template>

<style scoped>
.ms {
  height: 100%;
  background: #c0c0c0;
  padding: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  font-family: Tahoma, sans-serif;
  user-select: none;
}
.panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 230px;
  padding: 5px 8px;
  box-shadow: inset 2px 2px #808080, inset -2px -2px #fff;
  background: #c0c0c0;
}
.led {
  background: #000;
  color: #f00;
  font-family: 'Lucida Console', monospace;
  font-size: 22px;
  font-weight: bold;
  padding: 1px 5px;
  letter-spacing: 1px;
}
.face {
  width: 30px;
  height: 30px;
  font-size: 17px;
  border: none;
  background: #c0c0c0;
  box-shadow: inset -2px -2px #808080, inset 2px 2px #fff;
  cursor: pointer;
}
.face:active {
  box-shadow: inset 2px 2px #808080, inset -2px -2px #fff;
}
.board {
  display: grid;
  gap: 0;
  box-shadow: inset 3px 3px #808080, inset -3px -3px #fff;
  padding: 3px;
  background: #c0c0c0;
}
.cell {
  width: 22px;
  height: 22px;
  font-size: 13px;
  font-weight: bold;
  line-height: 1;
  border: none;
  padding: 0;
  background: #c0c0c0;
  box-shadow: inset -2px -2px #808080, inset 2px 2px #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell.revealed {
  box-shadow: inset 0 0 0 1px #808080;
  background: #bdbdbd;
  cursor: default;
}
.cell.mine {
  background: #ff5050;
}
.hint {
  font-size: 11px;
  color: #444;
  margin: 0;
}
.lives {
  font-size: 12px;
  color: #b00000;
  font-weight: bold;
}
.lives .none {
  color: #777;
  font-weight: normal;
}
.quiz {
  width: 100%;
  max-width: 230px;
  background: #fff;
  box-shadow: inset 2px 2px #808080, inset -2px -2px #fff;
  padding: 8px;
  margin-top: 2px;
}
.qtitle {
  margin: 0 0 5px;
  font-size: 12px;
  font-weight: bold;
  color: #1c4587;
}
.qtitle .reward {
  font-weight: normal;
  color: #777;
  font-size: 10px;
}
.q {
  margin: 0 0 6px;
  font-size: 12px;
  color: #222;
}
.opts {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.opts button {
  font-size: 12px;
  padding: 3px 6px;
  text-align: left;
}
.qmsg {
  margin: 6px 0 0;
  font-size: 11px;
  color: #1a7a1a;
}
</style>
