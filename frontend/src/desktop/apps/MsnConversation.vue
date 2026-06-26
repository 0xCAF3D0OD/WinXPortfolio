<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { profile } from '../../portfolio'
import { msnEmail, DISCORD_WEBHOOK_URL } from '../msnSession'
import { EMOTICONS, emoticonUrl, renderEmoticons } from '../msnEmoticons'

// Fenêtre de conversation MSN Messenger : le visiteur écrit à Kevin, le message
// part sur Discord (webhook). Émoticônes MSN authentiques (sélecteur + raccourcis).
interface MsnMessage {
  sender: string
  me: boolean
  text: string
  time: string
}

const me = () => msnEmail.value || 'Vous'
const history = ref<MsnMessage[]>([])
const draft = ref('')
const isSending = ref(false)
const editor = ref<HTMLTextAreaElement>()
const historyBox = ref<HTMLElement>()
const showEmojis = ref(false)
const mode = ref<'hand' | 'type'>('type')

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
function scrollDown() {
  nextTick(() => {
    if (historyBox.value) historyBox.value.scrollTop = historyBox.value.scrollHeight
  })
}

const ding = typeof Audio !== 'undefined' ? new Audio('/xp/sounds/ding.wav') : null
function playDing() {
  if (!ding) return
  ding.volume = 0.4
  ding.currentTime = 0
  ding.play().catch(() => {})
}

// --- Sélecteur d'émoticônes ---
function insertEmoticon(code: string) {
  const el = editor.value
  if (!el) {
    draft.value += code
  } else {
    const s = el.selectionStart
    const e = el.selectionEnd
    draft.value = draft.value.slice(0, s) + code + draft.value.slice(e)
    nextTick(() => {
      el.focus()
      el.selectionStart = el.selectionEnd = s + code.length
    })
  }
  showEmojis.value = false
}

const rootEl = ref<HTMLElement>()
function onDocDown(ev: PointerEvent) {
  if (showEmojis.value && rootEl.value && !rootEl.value.contains(ev.target as Node)) {
    showEmojis.value = false
  }
}
onMounted(() => document.addEventListener('pointerdown', onDocDown))
onUnmounted(() => document.removeEventListener('pointerdown', onDocDown))

async function send() {
  const text = draft.value.trim()
  if (!text || isSending.value) return
  isSending.value = true
  history.value.push({ sender: me(), me: true, text, time: now() })
  playDing()
  draft.value = ''
  scrollDown()
  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: `MSN — ${me()}`,
        content: text,
      }),
    })
  } catch {
    history.value.push({
      sender: 'Système',
      me: false,
      text: 'Le dernier message n’a pas pu être envoyé (erreur réseau).',
      time: now(),
    })
    scrollDown()
  } finally {
    isSending.value = false
  }
}
</script>

<template>
  <div ref="rootEl" class="conv">
    <!-- Barre de menus -->
    <div class="menubar">
      <span>Fichier</span><span>Edition</span><span>Affichage</span><span>Insertion</span
      ><span>Format</span><span>Outils</span><span>Message</span><span>?</span>
    </div>

    <!-- Barre d'outils (actions MSN) -->
    <div class="toolbar">
      <button class="tbtn"><img src="/xp/winxp-icons/msn.png" alt="" /><span>Inviter</span></button>
      <button class="tbtn">
        <img src="/xp/msn/msnexplorer.png" alt="" /><span>Envoyer des fichiers</span>
      </button>
      <button class="tbtn"><img src="/xp/winxp-icons/msn.png" alt="" /><span>Webcam</span></button>
      <button class="tbtn"><img src="/xp/msn/msnexplorer.png" alt="" /><span>Audio</span></button>
      <button class="tbtn"><img src="/xp/winxp-icons/msn.png" alt="" /><span>Activités</span></button>
      <button class="tbtn"><img src="/xp/msn/msnexplorer.png" alt="" /><span>Jeux</span></button>
    </div>

    <!-- Destinataire -->
    <div class="to-bar">
      À : <b>{{ profile.name }}</b> &lt;{{ profile.email }}&gt;
    </div>

    <div class="body">
      <!-- Colonne conversation -->
      <div class="left">
        <div class="info">
          <p>{{ profile.name.split(' ')[0] }} pourrait ne pas répondre tout de suite.</p>
          <p class="warn">
            Ne communiquez jamais votre mot de passe ni vos coordonnées bancaires dans une
            conversation.
          </p>
        </div>

        <div ref="historyBox" class="history">
          <div v-for="(m, i) in history" :key="i" class="msg">
            <span class="msg-meta" :class="{ mine: m.me }">{{ m.sender }} dit : ({{ m.time }})</span>
            <p class="msg-text" v-html="renderEmoticons(m.text)"></p>
          </div>
        </div>

        <!-- Barre de mise en forme (icônes MSN authentiques) -->
        <div class="format">
          <button class="fbtn" title="Police">
            <img src="/xp/msn/chat/change_font.png" alt="" /> Police
          </button>
          <span class="fsep"></span>
          <div class="emoji-wrap">
            <button class="fbtn" title="Émoticônes" @pointerdown.stop="showEmojis = !showEmojis">
              <img src="/xp/msn/chat/select_emoticon.png" alt="" />
              <img class="caret-ic" src="/xp/msn/chat/arrow.png" alt="" />
            </button>
            <div v-if="showEmojis" class="emoji-pop" @pointerdown.stop>
              <button
                v-for="e in EMOTICONS"
                :key="e.n"
                class="emoji-cell"
                :title="e.title + ' ' + e.codes[0]"
                @click="insertEmoticon(e.codes[0])"
              >
                <img :src="emoticonUrl(e.n)" :alt="e.codes[0]" />
              </button>
            </div>
          </div>
          <button class="fbtn" title="Clins d'œil">
            <img src="/xp/msn/chat/select_wink.png" alt="" /> Clins d'œil
            <img class="caret-ic" src="/xp/msn/chat/arrow.png" alt="" />
          </button>
          <button class="fbtn" title="Fonds">
            <img src="/xp/msn/chat/select_background.png" alt="" /> Fonds
            <img class="caret-ic" src="/xp/msn/chat/arrow.png" alt="" />
          </button>
          <button class="fbtn" title="Signal sonore">
            <img src="/xp/msn/chat/send_nudge.png" alt="" />
          </button>
        </div>

        <!-- Saisie + boutons Envoyer / Rechercher + toggle Manuscrit/Clavier -->
        <div class="write">
          <textarea
            ref="editor"
            v-model="draft"
            placeholder="Tapez un message… (les émoticônes :) (L) (Y) fonctionnent)"
            @keydown.enter.exact.prevent="send"
          ></textarea>
          <div class="write-side">
            <button class="send" :disabled="isSending" @click="send">Envoyer</button>
            <button class="send search inert">Rechercher</button>
            <div class="modes">
              <button
                class="mode"
                :class="{ active: mode === 'hand' }"
                title="Écriture manuscrite"
                @click="mode = 'hand'"
              >
                <img src="/xp/msn/chat/editortab.png" alt="" />
              </button>
              <button
                class="mode"
                :class="{ active: mode === 'type' }"
                title="Clavier"
                @click="mode = 'type'"
              >
                <b>A</b>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Colonne images d'affichage (display pictures) -->
      <aside class="dp">
        <div class="dp-frame"><img src="/xp/login/avatar.jpg" alt="" /></div>
        <div class="dp-frame me"><img src="/xp/WindowsXPIconsSVG/MSN Messenger.svg" alt="" /></div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.conv {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ece9d8;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #1a1a1a;
}
.menubar {
  display: flex;
  gap: 12px;
  padding: 3px 8px;
  background: #f3f6fb;
  border-bottom: 1px solid #c5d6ea;
  flex-shrink: 0;
}
.menubar span {
  cursor: default;
}

/* Barre d'outils */
.toolbar {
  display: flex;
  gap: 2px;
  padding: 4px 6px;
  background: linear-gradient(to bottom, #fbfdff, #dbe8f7);
  border-bottom: 1px solid #9cc0e9;
  flex-shrink: 0;
}
.tbtn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  min-width: 48px;
  padding: 2px 4px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: transparent;
  font-size: 11px;
  color: #15317e;
  cursor: pointer;
}
.tbtn img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.tbtn:hover {
  border-color: #aac6ea;
  background: #eaf3ff;
}

/* Destinataire */
.to-bar {
  padding: 4px 10px;
  background: #fff;
  border-bottom: 1px solid #c9d6e5;
  flex-shrink: 0;
}

.body {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 8px;
  padding: 8px;
}
.left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

/* Bandeau d'information */
.info {
  background: #fdfbe2;
  border: 1px solid #e6dca0;
  border-radius: 2px;
  padding: 5px 8px;
  font-size: 11px;
  flex-shrink: 0;
}
.info p {
  margin: 0;
}
.info .warn {
  margin-top: 3px;
  color: #555;
}

/* Historique */
.history {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #7f9db9;
  border-radius: 2px;
  padding: 8px;
}
.msg {
  margin-bottom: 8px;
  line-height: 1.35;
}
.msg-meta {
  font-weight: bold;
  font-size: 11px;
  color: #c2410c;
}
.msg-meta.mine {
  color: #1c5fd6;
}
.msg-text {
  margin: 1px 0 0 12px;
  word-break: break-word;
}
.msg-text :deep(.msn-emo) {
  width: 19px;
  height: 19px;
  vertical-align: -4px;
  image-rendering: pixelated;
}

/* Barre de mise en forme */
.format {
  display: flex;
  align-items: center;
  gap: 3px;
  flex-shrink: 0;
  padding: 2px 0;
}
.fbtn {
  display: inline-flex;
  align-items: center;
  gap: 1px;
  padding: 2px 5px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  font-size: 12px;
  color: #316ac5;
  cursor: pointer;
}
.fbtn:hover {
  background: #ffe1a0;
  border-color: #e5a420;
}
.fbtn img {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
}
.fbtn .caret-ic {
  width: 7px;
  height: 4px;
  margin-left: 1px;
}
.fsep {
  width: 1px;
  height: 16px;
  background: #c5d6ea;
  margin: 0 2px;
}

/* Toggle Manuscrit / Clavier (coin bas droit, façon MSN) */
.modes {
  display: flex;
  gap: 2px;
  margin-top: auto;
  justify-content: flex-end;
}
.mode {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 19px;
  color: #15317e;
  border: 1px solid #9cc0e9;
  border-radius: 2px;
  background: #dbe8f7;
  cursor: pointer;
}
.mode img {
  width: 16px;
  height: 16px;
  image-rendering: pixelated;
}
.mode b {
  font-family: Arial, sans-serif;
  font-size: 12px;
}
.mode.active {
  background: #fff;
  border-color: #4d7bbf;
}

/* Sélecteur d'émoticônes */
.emoji-wrap {
  position: relative;
}
.emoji-pop {
  position: absolute;
  bottom: 100%;
  left: 0;
  z-index: 30;
  width: 232px;
  max-height: 180px;
  overflow-y: auto;
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1px;
  padding: 4px;
  background: #fff;
  border: 1px solid #7f9db9;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
}
.emoji-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 1px solid transparent;
  border-radius: 2px;
  background: transparent;
  cursor: pointer;
}
.emoji-cell:hover {
  border-color: #e5a420;
  background: #ffe1a0;
}
.emoji-cell img {
  width: 19px;
  height: 19px;
  image-rendering: pixelated;
}

/* Saisie + colonne de boutons (Envoyer / Rechercher) + toggle */
.write {
  display: flex;
  gap: 6px;
  height: 74px;
  flex-shrink: 0;
}
.write textarea {
  flex: 1;
  resize: none;
  border: 1px solid #7f9db9;
  border-radius: 2px;
  padding: 6px;
  font-family: Tahoma, sans-serif;
  font-size: 12px;
  outline: none;
}
.write textarea:focus {
  border-color: #4d7bbf;
}
.write-side {
  width: 78px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.send {
  width: 100%;
  padding: 4px 0;
  font-weight: bold;
  color: #15317e;
  border: 1px solid #7f9db9;
  border-radius: 3px;
  background: linear-gradient(to bottom, #ffffff, #dee7f6);
  cursor: pointer;
}
.send:hover:not(:disabled) {
  background: linear-gradient(to bottom, #f5f8fd, #c4daf5);
  border-color: #4d7bbf;
}
.send:disabled {
  opacity: 0.6;
  cursor: default;
}
.send.search {
  font-weight: normal;
}

/* Images d'affichage */
.dp {
  width: 96px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.dp-frame {
  width: 96px;
  height: 96px;
  border: 1px solid #9bb8d8;
  background: #fff;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.dp-frame img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.dp-frame.me img {
  width: 64px;
  height: 64px;
  object-fit: contain;
}
</style>
