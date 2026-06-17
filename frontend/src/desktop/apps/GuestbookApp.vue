<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../../portfolio'

// 1) Crée une clé gratuite sur https://web3forms.com (associée à ton email)
// 2) Colle-la ci-dessous. Les messages (et la pièce jointe) te seront envoyés par email.
const WEB3FORMS_ACCESS_KEY = 'REMPLACE_PAR_TA_CLE_WEB3FORMS'

const fromEmail = ref('')
const subject = ref('Prise de contact')
const body = ref('')
const fileName = ref('')
let file: File | null = null
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

function onFile(e: Event) {
  const input = e.target as HTMLInputElement
  file = input.files?.[0] ?? null
  if (file && file.size > 5 * 1024 * 1024) {
    status.value = 'error'
    errorMsg.value = 'Fichier trop volumineux (max 5 Mo).'
    file = null
    fileName.value = ''
    input.value = ''
    return
  }
  fileName.value = file?.name ?? ''
  status.value = 'idle'
}

async function send() {
  if (!body.value.trim()) {
    status.value = 'error'
    errorMsg.value = 'Écris un message avant d’envoyer.'
    return
  }
  if (WEB3FORMS_ACCESS_KEY.startsWith('REMPLACE')) {
    status.value = 'error'
    errorMsg.value = 'Formulaire non configuré (clé Web3Forms manquante).'
    return
  }
  status.value = 'sending'
  try {
    const fd = new FormData()
    fd.append('access_key', WEB3FORMS_ACCESS_KEY)
    fd.append('subject', subject.value || 'Prise de contact')
    fd.append('from_name', fromEmail.value || 'Visiteur')
    fd.append('email', fromEmail.value || 'no-reply@portfolio')
    fd.append('message', body.value)
    if (file) fd.append('attachment', file, file.name)
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.success) {
      status.value = 'sent'
      body.value = ''
      fromEmail.value = ''
      file = null
      fileName.value = ''
    } else {
      throw new Error(data.message || 'Échec de l’envoi')
    }
  } catch (e) {
    status.value = 'error'
    errorMsg.value = e instanceof Error ? e.message : 'Échec de l’envoi'
  }
}
</script>

<template>
  <div class="oe">
    <!-- Menu -->
    <div class="menubar">
      <span>Fichier</span><span>Edition</span><span>Affichage</span><span>Insertion</span
      ><span>Format</span><span>Outils</span><span>Message</span><span>?</span>
    </div>

    <!-- Barre d'outils -->
    <div class="toolbar">
      <button class="tb send" :disabled="status === 'sending'" @click="send">
        <span class="ti">✉</span><span>Envoyer</span>
      </button>
      <span class="sep"></span>
      <button class="tb" disabled><span class="ti">✂</span>Couper</button>
      <button class="tb" disabled><span class="ti">⧉</span>Copier</button>
      <button class="tb" disabled><span class="ti">📋</span>Coller</button>
      <span class="sep"></span>
      <label class="tb attach"><span class="ti">📎</span>Joindre<input type="file" hidden @change="onFile" /></label>
    </div>

    <!-- En-têtes -->
    <div class="headers">
      <div class="row"><label>À :</label><div class="to">{{ profile.name }} &lt;{{ profile.email }}&gt;</div></div>
      <div class="row"><label>De :</label><input v-model="fromEmail" type="email" placeholder="votre email (pour la réponse)" /></div>
      <div class="row"><label>Objet :</label><input v-model="subject" type="text" /></div>
      <div v-if="fileName" class="row"><label>Joint :</label><div class="to">📎 {{ fileName }}</div></div>
    </div>

    <!-- Barre de mise en forme (décorative) -->
    <div class="format">
      <select disabled><option>Arial</option></select>
      <select disabled><option>10</option></select>
      <span class="sep"></span>
      <button disabled><b>G</b></button><button disabled><i>I</i></button
      ><button disabled><u>S</u></button>
    </div>

    <!-- Corps -->
    <textarea
      class="body"
      v-model="body"
      spellcheck="false"
      placeholder="Écris ton message…"
    ></textarea>

    <!-- État -->
    <div class="statusbar">
      <span v-if="status === 'sending'">Envoi en cours…</span>
      <span v-else-if="status === 'sent'" class="ok">Message envoyé, merci ! ✓</span>
      <span v-else-if="status === 'error'" class="err">{{ errorMsg }}</span>
      <span v-else>Prêt</span>
    </div>
  </div>
</template>

<style scoped>
.oe {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ece9d8;
  font-family: Tahoma, sans-serif;
}
.menubar {
  display: flex;
  gap: 12px;
  padding: 3px 8px;
  font-size: 12px;
  color: #1a1a1a;
  background: #ece9d8;
  flex-shrink: 0;
}
.menubar span {
  cursor: default;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 3px 6px;
  background: linear-gradient(to bottom, #fbfbf8, #e7e4d7);
  border-top: 1px solid #fff;
  border-bottom: 1px solid #aca899;
  flex-shrink: 0;
}
.tb {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 3px;
  padding: 3px 8px;
  font-size: 11px;
  color: #333;
  cursor: pointer;
}
.tb .ti {
  font-size: 16px;
  line-height: 1;
}
.tb:not(:disabled):hover {
  border-color: #b6c8e8;
  background: #eef4fd;
}
.tb:disabled {
  color: #aaa;
  cursor: default;
}
.tb.send {
  color: #14315a;
  font-weight: bold;
}
.tb.send .ti {
  color: #2a6fd6;
}
.toolbar .sep {
  width: 1px;
  height: 30px;
  background: #c5c2b8;
  margin: 0 4px;
}

.headers {
  background: #fff;
  border-bottom: 1px solid #aca899;
  padding: 2px 0;
  flex-shrink: 0;
}
.headers .row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.headers .row:last-child {
  border-bottom: none;
}
.headers label {
  width: 56px;
  text-align: right;
  padding: 4px 8px;
  font-size: 12px;
  color: #333;
  background: #ece9d8;
  align-self: stretch;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-shrink: 0;
}
.headers .to {
  padding: 4px 8px;
  font-size: 12px;
  color: #222;
}
.headers input {
  flex: 1;
  border: none;
  outline: none;
  padding: 4px 8px;
  font-size: 12px;
}

.format {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 6px;
  background: #ece9d8;
  border-bottom: 1px solid #aca899;
  flex-shrink: 0;
}
.format select,
.format button {
  font-size: 11px;
  padding: 1px 4px;
}
.format .sep {
  width: 1px;
  height: 16px;
  background: #c5c2b8;
  margin: 0 3px;
}

.body {
  flex: 1;
  min-height: 0;
  resize: none;
  border: none;
  outline: none;
  padding: 8px 10px;
  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.5;
  color: #111;
  background: #fff;
}
.statusbar {
  border-top: 1px solid #fff;
  background: #ece9d8;
  padding: 3px 8px;
  font-size: 11px;
  color: #555;
  flex-shrink: 0;
}
.statusbar .ok {
  color: #1a7a1a;
}
.statusbar .err {
  color: #b00000;
}
</style>
