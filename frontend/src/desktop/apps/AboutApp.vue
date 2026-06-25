<script setup lang="ts">
import { ref, reactive, computed, inject, onMounted, onUnmounted } from 'vue'
import { profile, about } from '../../portfolio'
import { useWindows, type WinState } from '../useWindows'

// Bloc-notes façon Windows XP : une vraie zone de texte éditable + une barre de
// menus déroulants qui agit réellement dessus (comme le Notepad de RebornXP, dont
// le bandeau pilote l'éditeur). On y charge le contenu « À propos ».
const win = inject<WinState | null>('win', null)
const { close } = useWindows()

const initial = [profile.name, `${profile.role} · ${profile.location}`, '', ...about].join('\n')
const text = ref(initial)
const wrap = ref(true)
const showStatus = ref(true)

const ta = ref<HTMLTextAreaElement>()
const caret = reactive({ ln: 1, col: 1 })
function updateCaret() {
  const el = ta.value
  if (!el) return
  const upto = el.value.slice(0, el.selectionStart)
  const lines = upto.split('\n')
  caret.ln = lines.length
  caret.col = (lines[lines.length - 1]?.length ?? 0) + 1
}

// --- Actions du menu ---
function focusTa() {
  ta.value?.focus()
}
function insertAtCaret(s: string) {
  const el = ta.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  text.value = el.value.slice(0, start) + s + el.value.slice(end)
  requestAnimationFrame(() => {
    el.selectionStart = el.selectionEnd = start + s.length
    el.focus()
    updateCaret()
  })
}
function newDoc() {
  text.value = ''
  focusTa()
}
function quit() {
  if (win) close(win)
}
function selectAll() {
  ta.value?.select()
}
function copy() {
  focusTa()
  document.execCommand('copy')
}
function cut() {
  focusTa()
  document.execCommand('cut')
}
async function paste() {
  try {
    const t = await navigator.clipboard.readText()
    insertAtCaret(t)
  } catch {
    /* permission refusée : on ignore silencieusement */
  }
}
function del() {
  const el = ta.value
  if (!el) return
  if (el.selectionStart !== el.selectionEnd) {
    text.value = el.value.slice(0, el.selectionStart) + el.value.slice(el.selectionEnd)
  }
}
function insertDate() {
  insertAtCaret(new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }))
}
function toggleWrap() {
  wrap.value = !wrap.value
}
function toggleStatus() {
  showStatus.value = !showStatus.value
}

// --- Barre de menus déroulants ---
interface MenuItem {
  label: string
  act?: () => void
  disabled?: boolean
  checked?: () => boolean
}
const menus: { name: string; groups: MenuItem[][] }[] = [
  {
    name: 'Fichier',
    groups: [
      [
        { label: 'Nouveau', act: newDoc },
        { label: 'Ouvrir…', disabled: true },
        { label: 'Enregistrer', disabled: true },
        { label: 'Enregistrer sous…', disabled: true },
      ],
      [{ label: 'Quitter', act: quit }],
    ],
  },
  {
    name: 'Édition',
    groups: [
      [{ label: 'Annuler', disabled: true }],
      [
        { label: 'Couper', act: cut },
        { label: 'Copier', act: copy },
        { label: 'Coller', act: paste },
        { label: 'Supprimer', act: del },
      ],
      [
        { label: 'Sélectionner tout', act: selectAll },
        { label: 'Heure/Date', act: insertDate },
      ],
    ],
  },
  {
    name: 'Format',
    groups: [
      [
        { label: 'Retour à la ligne automatique', act: toggleWrap, checked: () => wrap.value },
        { label: 'Police…', disabled: true },
      ],
    ],
  },
  {
    name: 'Affichage',
    groups: [[{ label: "Barre d'état", act: toggleStatus, checked: () => showStatus.value }]],
  },
  { name: '?', groups: [[{ label: 'À propos du Bloc-notes', disabled: true }]] },
]

const openMenu = ref<string | null>(null)
function toggleMenu(name: string) {
  openMenu.value = openMenu.value === name ? null : name
}
function hoverMenu(name: string) {
  if (openMenu.value) openMenu.value = name
}
function runItem(it: MenuItem) {
  if (it.disabled || !it.act) return
  it.act()
  openMenu.value = null
}
function closeMenus() {
  openMenu.value = null
}
onMounted(() => document.addEventListener('pointerdown', onDocDown))
onUnmounted(() => document.removeEventListener('pointerdown', onDocDown))
const rootEl = ref<HTMLElement>()
function onDocDown(e: PointerEvent) {
  if (rootEl.value && !rootEl.value.contains(e.target as Node)) closeMenus()
}

const statusLabel = computed(() => `Ln ${caret.ln}, Col ${caret.col}`)
</script>

<template>
  <div ref="rootEl" class="notepad">
    <!-- Barre de menus -->
    <div class="menubar">
      <div
        v-for="m in menus"
        :key="m.name"
        class="menu"
        :class="{ open: openMenu === m.name }"
        @pointerdown.stop="toggleMenu(m.name)"
        @pointerenter="hoverMenu(m.name)"
      >
        <span class="menu-label">{{ m.name }}</span>
        <div v-if="openMenu === m.name" class="dropdown" @pointerdown.stop>
          <template v-for="(group, gi) in m.groups" :key="gi">
            <hr v-if="gi > 0" />
            <button
              v-for="it in group"
              :key="it.label"
              class="ditem"
              :class="{ disabled: it.disabled }"
              @click="runItem(it)"
            >
              <span class="check">{{ it.checked && it.checked() ? '✓' : '' }}</span>
              <span class="dlabel">{{ it.label }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <!-- Zone d'édition -->
    <textarea
      ref="ta"
      v-model="text"
      class="paper"
      :class="{ nowrap: !wrap }"
      :wrap="wrap ? 'soft' : 'off'"
      spellcheck="false"
      @keyup="updateCaret"
      @click="updateCaret"
    ></textarea>

    <!-- Barre d'état -->
    <div v-if="showStatus" class="statusbar">
      <span class="sb-cell">{{ statusLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.notepad {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
}

/* Barre de menus */
.menubar {
  display: flex;
  flex-shrink: 0;
  padding: 1px 2px;
  background: #fff;
  border-bottom: 1px solid #d6d3ce;
  font-size: 12px;
  user-select: none;
}
.menu {
  position: relative;
}
.menu-label {
  display: inline-block;
  padding: 2px 7px;
  border: 1px solid transparent;
  color: #1a1a1a;
  cursor: default;
}
.menu.open .menu-label,
.menu:hover .menu-label {
  background: #2f71cd;
  color: #fff;
}

/* Menu déroulant */
.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 60;
  min-width: 180px;
  padding: 2px;
  background: #f1f0e9;
  border: 1px solid #8c8c8c;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.35);
}
.dropdown hr {
  margin: 2px 0;
  border: 0;
  border-top: 1px solid #c4c2b8;
}
.ditem {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 4px;
  padding: 3px 10px 3px 4px;
  border: 0;
  background: transparent;
  font-family: inherit;
  font-size: 12px;
  color: #1a1a1a;
  text-align: left;
  cursor: default;
}
.ditem:not(.disabled):hover {
  background: #2f71cd;
  color: #fff;
}
.ditem.disabled {
  color: #9b9b9b;
}
.check {
  width: 14px;
  flex-shrink: 0;
  text-align: center;
  font-size: 11px;
}
.dlabel {
  flex: 1;
}

/* Zone de texte */
.paper {
  flex: 1;
  min-height: 0;
  resize: none;
  border: 0;
  outline: 0;
  padding: 4px 6px;
  font-family: 'Lucida Console', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #111;
  background: #fff;
  white-space: pre-wrap;
  word-break: break-word;
}
.paper.nowrap {
  white-space: pre;
  word-break: normal;
  overflow-x: auto;
}

/* Barre d'état */
.statusbar {
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  border-top: 1px solid #d6d3ce;
  background: #ece9d8;
  font-size: 11px;
  color: #333;
}
.sb-cell {
  padding: 2px 16px;
  border-left: 1px solid #d6d3ce;
}
</style>
