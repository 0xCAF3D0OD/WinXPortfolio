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
</style>
