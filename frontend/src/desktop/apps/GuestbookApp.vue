<script setup lang="ts">
import { ref } from 'vue'

// 1) Crée une clé gratuite sur https://web3forms.com (associée à ton email)
// 2) Colle-la ci-dessous. Les messages te seront envoyés par email.
const WEB3FORMS_ACCESS_KEY = 'REMPLACE_PAR_TA_CLE_WEB3FORMS'

const name = ref('')
const message = ref('')
const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
const errorMsg = ref('')

async function send() {
  if (!message.value.trim()) {
    status.value = 'error'
    errorMsg.value = 'Écris un message avant d’envoyer.'
    return
  }
  if (WEB3FORMS_ACCESS_KEY.startsWith('REMPLACE')) {
    status.value = 'error'
    errorMsg.value = 'Livre d’or non configuré (clé Web3Forms manquante).'
    return
  }
  status.value = 'sending'
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Nouveau message — livre d’or du portfolio',
        from_name: name.value || 'Visiteur',
        name: name.value || 'Visiteur',
        message: message.value,
      }),
    })
    const data = await res.json()
    if (data.success) {
      status.value = 'sent'
      name.value = ''
      message.value = ''
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
  <div class="notepad">
    <!-- Barre de menus Bloc-notes -->
    <div class="menubar">
      <span>Fichier</span><span>Édition</span><span>Format</span><span>Affichage</span><span>?</span>
    </div>

    <!-- Zone de texte (le « document ») -->
    <textarea
      class="paper"
      v-model="message"
      spellcheck="false"
      wrap="soft"
      placeholder="Laisse-moi un message…&#10;&#10;(il me sera envoyé par email)"
    ></textarea>

    <!-- Barre d'état façon XP : nom + envoyer -->
    <div class="status-bar">
      <div class="status-bar-field grow">
        <span v-if="status === 'sending'">Envoi en cours…</span>
        <span v-else-if="status === 'sent'" class="ok">Message envoyé, merci ! ✓</span>
        <span v-else-if="status === 'error'" class="err">{{ errorMsg }}</span>
        <span v-else>Prêt</span>
      </div>
      <div class="status-bar-field">
        <input type="text" v-model="name" placeholder="Ton nom" aria-label="Ton nom" />
      </div>
      <div class="status-bar-field">
        <button :disabled="status === 'sending'" @click="send">Envoyer</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notepad {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.menubar {
  display: flex;
  gap: 14px;
  padding: 3px 8px;
  font-size: 12px;
  color: #1a1a1a;
  border-bottom: 1px solid #d6d3ce;
  flex-shrink: 0;
}
.menubar span {
  cursor: default;
}
.paper {
  flex: 1;
  min-height: 0;
  margin: 0;
  resize: none;
  border: none;
  border-top: 1px solid #808080;
  padding: 4px 6px;
  font-family: 'Lucida Console', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #111;
  outline: none;
}
/* Barre d'état : reprend les codes XP.css (.status-bar / .status-bar-field) */
.status-bar {
  display: flex;
  gap: 2px;
  padding: 2px 3px;
  background: #ece9d8;
  border-top: 1px solid #fff;
  flex-shrink: 0;
}
.status-bar-field {
  box-shadow: inset 1px 1px #808080, inset -1px -1px #fff;
  padding: 2px 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.status-bar-field.grow {
  flex: 1;
}
.status-bar-field input {
  width: 110px;
}
.status-bar-field .ok {
  color: #1a7a1a;
}
.status-bar-field .err {
  color: #b00000;
}
</style>
