<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { profile } from '../../portfolio'
import { articles as fallbackArticles, type Article } from '../../blog'

// Windows Messenger — interface reproduite des captures fournies (écran de
// connexion + .NET Messenger Service, puis fenêtre de conversation). Le contenu
// est le blog de Kevin (articles depuis public/blog/articles.json).
type View = 'signin' | 'conv'
const view = ref<View>('signin')
const dialog = ref(false)
const email = ref(profile.email)

const articles = ref<Article[]>(fallbackArticles)
onMounted(async () => {
  try {
    const res = await fetch('/blog/articles.json', { cache: 'no-cache' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) articles.value = data
    }
  } catch {
    /* repli sur blog.ts */
  }
})

function signIn() {
  dialog.value = false
  view.value = 'conv'
}

// Panneau latéral « I want to… » (inerte, décoratif comme dans Messenger).
const wishItems = [
  'Inviter quelqu\'un dans cette conversation',
  'Envoyer un fichier ou une photo',
  'Démarrer l\'Assistance à distance',
  'Partager une application',
  'Démarrer un tableau blanc',
]
const now = new Date().toLocaleString('fr-FR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})
</script>

<template>
  <div class="wm">
    <!-- Barre de menus (inerte) -->
    <div class="wm-menu">
      <span class="inert">Fichier</span>
      <span class="inert">Actions</span>
      <span class="inert">Outils</span>
      <span class="inert">?</span>
    </div>

    <!-- ÉCRAN DE CONNEXION -->
    <template v-if="view === 'signin'">
      <div class="wm-signin">
        <a class="wm-signin-link" @click="dialog = true">
          <img src="/xp/msn/windowsmesenger.png" alt="" />
          <span>Cliquez ici pour vous connecter</span>
        </a>
        <img class="wm-buddies" src="/xp/msn/windowsmesenger.png" alt="" />
      </div>

      <!-- Dialogue .NET Messenger Service -->
      <div v-if="dialog" class="net-overlay" @pointerdown.self="dialog = false">
        <div class="net">
          <div class="net-title">
            <span>.NET Messenger Service</span>
            <button class="net-x" @click="dialog = false">✕</button>
          </div>
          <div class="net-body">
            <img class="net-ico" src="/xp/msn/windowsmesenger.png" alt="" />
            <div class="net-form">
              <p class="net-intro">
                Connectez-vous avec votre .NET Passport pour voir vos contacts en ligne,
                converser et recevoir des alertes.
              </p>
              <label>Adresse e-mail :</label>
              <input v-model="email" type="email" />
              <label>Mot de passe :</label>
              <input type="password" value="passport" />
              <div class="net-buttons">
                <button class="net-ok" @click="signIn">OK</button>
                <button class="net-cancel" @click="dialog = false">Annuler</button>
              </div>
            </div>
          </div>
          <div class="net-foot">
            <a class="inert">Obtenir un .NET Passport</a>
            <a class="inert">Aide</a>
            <span class="net-passport">.NET&nbsp;Passport</span>
          </div>
        </div>
      </div>
    </template>

    <!-- FENÊTRE DE CONVERSATION (le blog) -->
    <template v-else>
      <div class="wm-conv">
        <div class="wm-main">
          <div class="wm-to">
            À : <b>Blog de {{ profile.name }}</b> &lt;{{ email }}&gt;
            <button class="wm-signout inert" @click="view = 'signin'">Déconnexion</button>
          </div>

          <div class="wm-messages">
            <p class="wm-notice">
              <span class="warn">⚠</span> Ne communiquez jamais votre mot de passe ni vos numéros
              de carte dans une conversation par messagerie instantanée.
            </p>

            <div v-for="(a, i) in articles" :key="i" class="wm-msg">
              <p class="wm-sender">{{ profile.name }} a écrit&nbsp;:</p>
              <p class="wm-line wm-mtitle">{{ a.title }} <span class="wm-date">· {{ a.date }}</span></p>
              <p v-for="(p, k) in a.body" :key="k" class="wm-line">{{ p }}</p>
              <div v-if="a.images?.length" class="wm-photos">
                <a
                  v-for="(src, k) in a.images"
                  :key="k"
                  class="wm-photo"
                  :href="src"
                  target="_blank"
                  rel="noopener"
                  title="Ouvrir la photo en grand"
                >
                  <img :src="src" alt="" loading="lazy" />
                </a>
              </div>
              <p v-if="a.tags?.length" class="wm-tags">
                <span v-for="t in a.tags" :key="t">#{{ t }}</span>
              </p>
            </div>
          </div>

          <div class="wm-tools">
            <span class="inert"><i class="t-block"></i>Bloquer</span>
            <span class="inert"><i class="t-font">A</i>Police</span>
            <span class="inert"><i class="t-emo">☺</i>Émoticônes ▾</span>
          </div>
          <div class="wm-compose">
            <textarea placeholder="Écrivez un message…"></textarea>
            <button class="wm-send inert">Envoyer</button>
          </div>
        </div>

        <!-- Panneau latéral « I want to… » -->
        <aside class="wm-side">
          <div class="wm-side-h">Démarrer la caméra <span>≫</span></div>
          <div class="wm-side-h">Démarrer une conversation audio <span>≫</span></div>
          <div class="wm-side-h active">Je veux… <span>≫</span></div>
          <ul class="wm-wish">
            <li v-for="w in wishItems" :key="w" class="inert"><i></i>{{ w }}</li>
          </ul>
        </aside>
      </div>
      <div class="wm-status">Dernier message reçu le {{ now }}</div>
    </template>
  </div>
</template>

<style scoped>
.wm {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #111;
}
/* Élément inerte : visible, cliquable, mais grisé (sans effet) */
.inert {
  color: #9a9a9a;
}

/* Barre de menus */
.wm-menu {
  display: flex;
  gap: 14px;
  padding: 3px 8px;
  font-size: 12px;
  background: linear-gradient(to bottom, #fdfdfd, #ecebe4);
  border-bottom: 1px solid #c5c2b8;
  flex-shrink: 0;
}
.wm-menu span {
  cursor: pointer;
}

/* Écran de connexion */
.wm-signin {
  flex: 1;
  position: relative;
  background: #fff;
  border: 2px solid #2f6fd0;
  margin: 6px;
  overflow: hidden;
}
.wm-signin-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  width: max-content;
  margin: 40px auto 0;
  color: #0a3d91;
  cursor: pointer;
}
.wm-signin-link img {
  width: 40px;
  height: 40px;
}
.wm-signin-link span {
  font-weight: bold;
  text-decoration: underline;
}
.wm-buddies {
  position: absolute;
  left: 8px;
  bottom: 6px;
  width: 96px;
  height: 96px;
  opacity: 0.18;
}

/* Dialogue .NET Messenger Service */
.net-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.12);
  z-index: 20;
}
.net {
  width: 320px;
  background: #ece9d8;
  border: 1px solid #0831d9;
  box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.4);
}
.net-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3px 4px 3px 8px;
  color: #fff;
  font-weight: bold;
  background: linear-gradient(to bottom, #2f8bf0, #1257cf);
}
.net-x {
  width: 18px;
  height: 18px;
  border: 1px solid #fff;
  border-radius: 3px;
  background: #d24a3b;
  color: #fff;
  font-size: 10px;
  cursor: pointer;
}
.net-body {
  display: flex;
  gap: 10px;
  padding: 12px;
}
.net-ico {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
}
.net-form {
  flex: 1;
}
.net-intro {
  margin: 0 0 8px;
  font-size: 11px;
  line-height: 1.4;
}
.net-form label {
  display: block;
  font-size: 11px;
  margin: 4px 0 1px;
}
.net-form input {
  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  padding: 2px 4px;
  border: 1px solid #7f9db9;
}
.net-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 10px;
}
.net-buttons button {
  min-width: 64px;
  font-size: 12px;
  padding: 2px 8px;
  cursor: pointer;
}
.net-foot {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 6px 10px 8px;
  font-size: 11px;
}
.net-foot a {
  cursor: pointer;
}
.net-passport {
  margin-left: auto;
  font-style: italic;
  color: #2a6;
  font-weight: bold;
}

/* Conversation (blog) */
.wm-conv {
  flex: 1;
  min-height: 0;
  display: flex;
}
.wm-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.wm-to {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  font-size: 12px;
  background: linear-gradient(to bottom, #eaf3ff, #cfe4fb);
  border-bottom: 1px solid #9cc0e9;
}
.wm-signout {
  margin-left: auto;
  background: transparent;
  border: none;
  font-size: 11px;
  cursor: pointer;
}
.wm-messages {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 8px 10px;
}
.wm-notice {
  display: flex;
  gap: 6px;
  margin: 0 0 10px;
  font-size: 11px;
  color: #555;
}
.wm-notice .warn {
  color: #c89a00;
}
.wm-msg {
  margin-bottom: 12px;
}
.wm-sender {
  margin: 0;
  color: #444;
  font-size: 12px;
}
.wm-line {
  margin: 2px 0 0 18px;
  line-height: 1.45;
}
.wm-mtitle {
  font-weight: bold;
  color: #0a3d91;
}
.wm-date {
  font-weight: normal;
  color: #888;
  font-size: 11px;
}
.wm-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 6px 0 0 18px;
}
.wm-photo {
  display: block;
  border: 1px solid #9bb8d8;
  background: #fff;
  padding: 3px;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  line-height: 0;
}
.wm-photo:hover {
  border-color: #2f6fd0;
}
.wm-photo img {
  display: block;
  max-width: 220px;
  max-height: 165px;
  object-fit: cover;
}
.wm-tags {
  margin: 4px 0 0 18px;
}
.wm-tags span {
  font-size: 11px;
  color: #2f6fd0;
  margin-right: 6px;
}
.wm-tools {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 4px 10px;
  border-top: 1px solid #cdddf2;
  border-bottom: 1px solid #cdddf2;
  background: #f3f8ff;
  font-size: 12px;
}
.wm-tools span {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.wm-tools i {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-style: normal;
  font-weight: bold;
}
.t-block {
  border-radius: 50%;
  border: 2px solid #c33;
  position: relative;
}
.t-emo {
  color: #e0a400;
}
.wm-compose {
  display: flex;
  gap: 6px;
  padding: 8px 10px;
}
.wm-compose textarea {
  flex: 1;
  height: 46px;
  resize: none;
  font-family: inherit;
  font-size: 12px;
  border: 1px solid #7f9db9;
  padding: 4px;
}
.wm-send {
  width: 70px;
  align-self: stretch;
  background: #f0f0f0;
  border: 1px solid #9aa0a6;
  cursor: pointer;
}

/* Panneau latéral « Je veux… » */
.wm-side {
  width: 168px;
  flex-shrink: 0;
  background: #b6cdf2;
  border-left: 1px solid #7f9db9;
  overflow: auto;
}
.wm-side-h {
  display: flex;
  justify-content: space-between;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: bold;
  color: #15317e;
  background: linear-gradient(to bottom, #cfe0fb, #aac4ee);
  border-bottom: 1px solid #8fb0e0;
  cursor: pointer;
}
.wm-side-h.active {
  background: linear-gradient(to bottom, #e9f0ff, #c7d8f6);
}
.wm-wish {
  list-style: none;
  margin: 0;
  padding: 6px 8px;
}
.wm-wish li {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 0;
  font-size: 12px;
  cursor: pointer;
}
.wm-wish li i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #8aa6d6;
  flex-shrink: 0;
}
.wm-status {
  padding: 2px 8px;
  font-size: 11px;
  color: #555;
  background: #ece9d8;
  border-top: 1px solid #c5c2b8;
  flex-shrink: 0;
}
</style>
