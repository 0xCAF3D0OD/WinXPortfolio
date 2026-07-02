<script setup lang="ts">
import { ref, inject } from 'vue'
import { useWindows, type WinState } from '../useWindows'

// Fenêtre « Exécuter… » façon Windows XP (reprise du composant Run de react-xp).
// Ouvre des applications par leur nom, des URLs, et cache quelques easter eggs.
const openApp = inject<(id: string) => void>('openApp', () => {})
const showError = inject<(message?: string) => void>('showError', () => {})
const launchWinError = inject<() => void>('launchWinError', () => {})
const triggerBsod = inject<() => void>('triggerBsod', () => {})
const win = inject<WinState | null>('win', null)
const { close } = useWindows()

const command = ref('')
const msg = ref('')

function closeSelf() {
  if (win) close(win)
}

// Noms de commandes XP → id d'application du portfolio.
const ALIASES: Record<string, string> = {
  cmd: 'terminal',
  'cmd.exe': 'terminal',
  command: 'terminal',
  terminal: 'terminal',
  notepad: 'about',
  'notepad.exe': 'about',
  iexplore: 'iexplorer',
  iexplorer: 'iexplorer',
  explorer: 'iexplorer',
  internet: 'iexplorer',
  control: 'controlpanel',
  controlpanel: 'controlpanel',
  mycomputer: 'mycomputer',
  poste: 'mycomputer',
  projets: 'projects',
  projects: 'projects',
  winamp: 'webamp',
  wmplayer: 'webamp',
  mplayer: 'webamp',
  mplayer2: 'webamp',
  msn: 'msn',
  msnmsgr: 'msn',
  messenger: 'messenger',
  mail: 'guestbook',
  outlook: 'guestbook',
  msimn: 'guestbook',
  contact: 'contact',
  sol: 'game-solitaire',
  solitaire: 'game-solitaire',
  winmine: 'game-minesweeper',
  demineur: 'game-minesweeper',
  hearts: 'game-hearts',
  morpion: 'game-morpion',
  pinball: 'game-pinball',
  wscui: 'security',
  'wscui.cpl': 'security',
  security: 'security',
  help: 'help',
}

// Easter eggs : un message inline ou une action rigolote façon XP.
function easterEgg(cmd: string): boolean {
  switch (cmd) {
    case 'bsod':
    case 'blue':
    case 'crash':
    case 'stop':
      triggerBsod()
      closeSelf()
      return true
    case 'format':
    case 'format c:':
    case 'format c: /q':
    case 'del c:':
      launchWinError()
      closeSelf()
      return true
    case 'regedit':
    case 'regedt32':
      msg.value = 'Modifier le Registre peut rendre le système instable. (Bien tenté 😉)'
      return true
    case 'winver':
      msg.value = 'Windoors XP [Version 5.1.2600] — build 0xCAF3D00D'
      return true
    case 'sfc':
    case 'sfc /scannow':
      msg.value = 'Analyse des fichiers système protégés… aucune violation d’intégrité. ✔'
      return true
    case 'matrix':
      msg.value = 'Wake up, Neo… (il n’y a pas de cuillère 🥄)'
      return true
    case 'whoami':
    case 'hello':
    case 'bonjour':
      msg.value = 'Bonjour ! Kevin Di Nocera — DevOps / Platform Engineer 👋'
      return true
    case 'coffee':
    case 'cafe':
      msg.value = '☕ Erreur 418 : je suis une théière.'
      return true
    default:
      return false
  }
}

function run() {
  const raw = command.value.trim()
  if (!raw) return
  msg.value = ''
  const key = raw.toLowerCase()

  if (easterEgg(key)) return

  // URL → nouvel onglet.
  if (/^(https?:\/\/|www\.)/i.test(raw)) {
    const url = raw.startsWith('http') ? raw : 'https://' + raw
    window.open(url, '_blank', 'noopener')
    closeSelf()
    return
  }

  // Nom d'application connu.
  const appId = ALIASES[key]
  if (appId) {
    openApp(appId)
    closeSelf()
    return
  }

  // Sinon : erreur XP authentique (la fenêtre reste ouverte).
  showError(
    `Windows ne trouve pas « ${raw} ». Vérifiez que vous avez correctement saisi le nom, puis réessayez.`,
  )
}
</script>

<template>
  <div class="run">
    <div class="run-top">
      <img class="run-ico" src="/xp/start/run.png" alt="" />
      <p class="run-text">
        Tapez le nom d'un programme, d'un dossier, d'un document ou d'une ressource Internet, et
        Windows l'ouvrira pour vous.
      </p>
    </div>

    <div class="run-open">
      <label>Ouvrir :</label>
      <div class="run-field">
        <input
          v-model="command"
          type="text"
          autofocus
          spellcheck="false"
          @keydown.enter.prevent="run"
        />
        <span class="run-drop">▾</span>
      </div>
    </div>

    <p v-if="msg" class="run-msg">{{ msg }}</p>

    <div class="run-buttons">
      <button class="run-btn" :disabled="!command.trim()" @click="run">Ok</button>
      <button class="run-btn" @click="closeSelf">Annuler</button>
      <button class="run-btn" disabled>Parcourir…</button>
    </div>
  </div>
</template>

<style scoped>
.run {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  padding: 14px 12px 12px;
  background: #ece9d8;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #111;
}
.run-top {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
.run-ico {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.run-text {
  margin: 0;
  line-height: 1.4;
}
.run-open {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 16px 0 6px;
}
.run-open label {
  width: 48px;
  text-align: right;
}
.run-field {
  flex: 1;
  display: flex;
  align-items: stretch;
  border: 1px solid #7f9db9;
  background: #fff;
}
.run-field input {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  padding: 3px 5px;
  font-family: inherit;
  font-size: 12px;
}
.run-drop {
  width: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  color: #1a3d6e;
  background: linear-gradient(to bottom, #fdfdfd, #d3dcea);
  border-left: 1px solid #7f9db9;
}
.run-msg {
  margin: 2px 0 0 56px;
  color: #15428b;
  font-style: italic;
}
.run-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
}
.run-btn {
  min-width: 72px;
  padding: 3px 10px;
  font-family: inherit;
  font-size: 12px;
  border: 1px solid #003c74;
  border-radius: 3px;
  background: linear-gradient(to bottom, #fefefe 0%, #eef3fb 48%, #d8e4f4 52%, #eaf1fb 100%);
  cursor: pointer;
}
.run-btn:not(:disabled):hover {
  border-color: #e9a900;
  background: linear-gradient(to bottom, #fffefb 0%, #fff3d6 48%, #ffe6a8 52%, #fff2cf 100%);
}
.run-btn:disabled {
  color: #9a9a9a;
  border-color: #a7a6a0;
  background: #ece9d8;
  cursor: default;
}
</style>
