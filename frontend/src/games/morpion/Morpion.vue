<script setup lang="ts">
import { ref, computed } from 'vue'

type Mark = '' | 'X' | 'O'
const board = ref<Mark[]>(Array(9).fill(''))
const msg = ref('À toi de jouer (X)')
const over = ref(false)

const lines: [number, number, number][] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

function winner(b: Mark[]): Mark | 'draw' | null {
  for (const [a, c, d] of lines) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a] as Mark
  }
  return b.every((x) => x) ? 'draw' : null
}

function aiMove() {
  const empty = board.value.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0)
  if (!empty.length) return
  // gagne si possible, sinon bloque, sinon aléatoire
  const tryFind = (mark: Mark) => {
    for (const i of empty) {
      const copy = [...board.value]
      copy[i] = mark
      if (winner(copy) === mark) return i
    }
    return -1
  }
  let move = tryFind('O')
  if (move < 0) move = tryFind('X')
  if (move < 0) move = empty[Math.floor(Math.random() * empty.length)]!
  board.value[move] = 'O'
}

function play(i: number) {
  if (over.value || board.value[i]) return
  board.value[i] = 'X'
  let w = winner(board.value)
  if (!w) {
    aiMove()
    w = winner(board.value)
  }
  if (w === 'X') ((msg.value = 'Gagné ! 🎉'), (over.value = true))
  else if (w === 'O') ((msg.value = 'Perdu… 😅'), (over.value = true))
  else if (w === 'draw') ((msg.value = 'Match nul.'), (over.value = true))
}

function reset() {
  board.value = Array(9).fill('')
  msg.value = 'À toi de jouer (X)'
  over.value = false
}

const cellColor = (m: Mark) => (m === 'X' ? '#1c4587' : '#a32d2d')
const _ = computed(() => board.value)
</script>

<template>
  <div class="morpion">
    <p class="msg">{{ msg }}</p>
    <div class="grid">
      <button v-for="(c, i) in board" :key="i" class="cell" :style="{ color: cellColor(c) }" @click="play(i)">
        {{ c }}
      </button>
    </div>
    <button class="reset" @click="reset">Nouvelle partie</button>
  </div>
</template>

<style scoped>
.morpion {
  height: 100%;
  background: #ece9d8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-family: Tahoma, sans-serif;
}
.msg {
  margin: 0;
  font-size: 13px;
  font-weight: bold;
  color: #14315a;
}
.grid {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(3, 60px);
  gap: 4px;
  background: #808080;
  padding: 4px;
}
.cell {
  font-size: 34px;
  font-weight: bold;
  border: none;
  background: #fff;
  box-shadow: inset -2px -2px #b0b0b0, inset 2px 2px #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cell:hover {
  background: #f0f6ff;
}
.reset {
  font-size: 12px;
  padding: 4px 14px;
}
</style>
