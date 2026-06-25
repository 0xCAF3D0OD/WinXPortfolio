<script setup lang="ts">
import { ref, computed } from 'vue'
import { profile } from '../../portfolio'

// MSN — interface MSN Messenger (écran de connexion → chat). Le « chat » est en
// réalité le serveur Discord de Kevin, intégré via WidgetBot (affiche les vrais
// messages, contrairement au widget Discord officiel qui ne montre que les
// membres en ligne).
//
// CONFIG :
//  - DISCORD_SERVER_ID : l'ID de ton serveur Discord.
//  - DISCORD_CHANNEL_ID : l'ID du salon à afficher (clic droit sur le salon →
//    « Copier l'identifiant »).
//  - Il faut aussi inviter le bot WidgetBot sur ton serveur : https://widgetbot.io
const DISCORD_SERVER_ID = '1519700730435604480'
const DISCORD_CHANNEL_ID = ''

const chatUrl = computed(() =>
  DISCORD_SERVER_ID && DISCORD_CHANNEL_ID
    ? `https://e.widgetbot.io/channels/${DISCORD_SERVER_ID}/${DISCORD_CHANNEL_ID}`
    : '',
)

const view = ref<'signin' | 'online'>('signin')
const email = ref(profile.email)
</script>

<template>
  <div class="msn">
    <!-- Barre de menus (inerte) -->
    <div class="msn-menu">
      <span class="inert">Fichier</span>
      <span class="inert">Contacts</span>
      <span class="inert">Actions</span>
      <span class="inert">Outils</span>
      <span class="inert">?</span>
    </div>

    <!-- En-tête msn Messenger -->
    <div class="msn-brand">
      <img src="/xp/msn/msnlogo.png" alt="msn Messenger" />
    </div>

    <!-- ÉCRAN DE CONNEXION -->
    <template v-if="view === 'signin'">
      <div class="msn-signin">
        <div class="msn-avatar"><img src="/xp/msn/windowsmesenger.png" alt="" /></div>

        <label>Adresse e-mail :</label>
        <div class="msn-field">
          <input v-model="email" type="email" />
          <span class="msn-caret">▾</span>
        </div>

        <label>Mot de passe :</label>
        <div class="msn-field"><input type="password" value="passport" /></div>

        <p class="msn-status">État : <b>En ligne</b> <span class="msn-caret">▾</span></p>

        <label class="msn-check"><input type="checkbox" /> Se souvenir de moi</label>
        <label class="msn-check"><input type="checkbox" /> Mémoriser mon mot de passe</label>
        <label class="msn-check"><input type="checkbox" /> Me connecter automatiquement</label>

        <button class="msn-signinbtn" @click="view = 'online'">Se connecter</button>

        <div class="msn-links">
          <a class="inert">Mot de passe oublié ?</a>
          <a class="inert">État du service</a>
          <a class="inert">Obtenir un compte</a>
        </div>

        <div class="msn-buddies"><img src="/xp/msn/windowsmesenger.png" alt="" /></div>
      </div>
      <div class="msn-passport">
        <img src="/xp/msn/msnexplorer.png" alt="" />
        Réseau Microsoft Passport
      </div>
    </template>

    <!-- CONNECTÉ : le serveur Discord (via WidgetBot) -->
    <template v-else>
      <div class="msn-online-head">
        <img class="msn-online-pp" src="/xp/login/avatar.jpg" alt="" />
        <div>
          <p class="msn-online-name">{{ profile.name }} <span>(En ligne)</span></p>
          <p class="msn-online-msg">Discutez avec moi sur Discord ↓</p>
        </div>
        <button class="msn-signout inert" @click="view = 'signin'">Déconnexion</button>
      </div>

      <div class="msn-chat">
        <iframe
          v-if="chatUrl"
          :src="chatUrl"
          title="Discord"
          allow="clipboard-write; fullscreen"
        ></iframe>
        <div v-else class="msn-setup">
          <p class="msn-setup-title">Chat Discord à activer</p>
          <p class="msn-setup-text">
            Pour afficher les messages, j'utilise <b>WidgetBot</b> (le widget Discord officiel ne
            montre que les membres en ligne, pas les messages) :
          </p>
          <ol class="msn-setup-steps">
            <li>Invite le bot WidgetBot sur ton serveur : <code>widgetbot.io</code>.</li>
            <li>
              Renseigne <code>DISCORD_CHANNEL_ID</code> dans <code>DiscordApp.vue</code> (clic droit
              sur le salon → « Copier l'identifiant »).
            </li>
          </ol>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.msn {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(to bottom, #f4f9ff, #dceaf8);
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #1a1a1a;
}
.inert {
  color: #9a9a9a;
}

/* Barre de menus */
.msn-menu {
  display: flex;
  gap: 14px;
  padding: 3px 8px;
  background: linear-gradient(to bottom, #fdfdfd, #e9f1fb);
  border-bottom: 1px solid #b9d2ec;
  flex-shrink: 0;
}
.msn-menu span {
  cursor: pointer;
}

/* En-tête msn Messenger */
.msn-brand {
  padding: 6px 10px 2px;
  flex-shrink: 0;
}
.msn-brand img {
  height: 22px;
}

/* Écran de connexion */
.msn-signin {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6px 22px 12px;
  overflow: auto;
}
.msn-avatar {
  width: 74px;
  height: 74px;
  margin: 6px 0 14px;
  border: 1px solid #9bb8d8;
  border-radius: 6px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}
.msn-avatar img {
  width: 54px;
  height: 54px;
}
.msn-signin label {
  align-self: flex-start;
  font-size: 12px;
  margin: 6px 0 2px;
}
.msn-field {
  position: relative;
  width: 100%;
}
.msn-field input {
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  padding: 3px 18px 3px 5px;
  border: 1px solid #7f9db9;
}
.msn-caret {
  color: #4f7bbf;
  font-size: 10px;
}
.msn-field .msn-caret {
  position: absolute;
  right: 5px;
  top: 4px;
}
.msn-status {
  align-self: flex-start;
  margin: 10px 0 8px;
  font-size: 12px;
}
.msn-check {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  margin: 1px 0;
}
.msn-check input {
  width: 13px;
  height: 13px;
}
.msn-signinbtn {
  margin: 14px 0 6px;
  padding: 4px 22px;
  font-size: 12px;
  border: 1px solid #c79a3a;
  border-radius: 3px;
  background: linear-gradient(to bottom, #fff7e0, #ffe7a8);
  cursor: pointer;
}
.msn-signinbtn:hover {
  background: linear-gradient(to bottom, #fffbe9, #ffedbb);
}
.msn-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin-top: 10px;
}
.msn-links a {
  color: #1c5fd6;
  cursor: pointer;
  text-decoration: underline;
}
.msn-buddies {
  position: absolute;
  right: 8px;
  bottom: 4px;
  opacity: 0.16;
  pointer-events: none;
}
.msn-buddies img {
  width: 96px;
  height: 96px;
}
.msn-passport {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  font-size: 11px;
  color: #355;
  background: #dfeaf6;
  border-top: 1px solid #b9d2ec;
  flex-shrink: 0;
}
.msn-passport img {
  width: 16px;
  height: 16px;
}

/* Connecté : bandeau MSN + chat Discord */
.msn-online-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  background: linear-gradient(to bottom, #eaf3ff, #cfe4fb);
  border-bottom: 1px solid #9cc0e9;
  flex-shrink: 0;
}
.msn-online-pp {
  width: 38px;
  height: 38px;
  border: 1px solid #9bb8d8;
  border-radius: 4px;
  object-fit: cover;
}
.msn-online-name {
  margin: 0;
  font-weight: bold;
  color: #15317e;
}
.msn-online-name span {
  font-weight: normal;
  color: #2a8a2a;
  font-size: 11px;
}
.msn-online-msg {
  margin: 1px 0 0;
  font-size: 11px;
  color: #555;
}
.msn-signout {
  margin-left: auto;
  background: transparent;
  border: none;
  font-size: 11px;
  cursor: pointer;
}
.msn-chat {
  flex: 1;
  min-height: 0;
  background: #36393f;
}
.msn-chat iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.msn-setup {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  padding: 20px 24px;
  background: #fff;
  color: #333;
}
.msn-setup-title {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #15317e;
}
.msn-setup-text {
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
}
.msn-setup-steps {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  line-height: 1.6;
}
.msn-setup code {
  background: #eef2fb;
  border: 1px solid #d3def0;
  border-radius: 3px;
  padding: 0 3px;
  font-size: 11px;
}
</style>
