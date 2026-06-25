<script setup lang="ts">
import { ref, inject } from 'vue'
import { apps, type AppDef } from './registry'
import { profile } from '../portfolio'
import StartSubMenu from './StartSubMenu.vue'
import { allProgramsMenu, connectToMenu, recentDocumentsMenu } from './startMenuData'

const emit = defineEmits<{ open: [AppDef]; logoff: []; close: [] }>()

// Popup « Application not found » pour les entrées non implémentées.
const showError = inject<(message?: string) => void>('showError', () => {})

const avatarSrc = ref('/xp/login/avatar.jpg')
function avatarFallback() {
  avatarSrc.value = '/xp/login/avatar.ico'
}

const byId = (id: string) => apps.find((a) => a.id === id)!
const pinned = ['terminal', 'about'].map(byId)
const frequent = ['projects', 'controlpanel', 'contact', 'iexplorer', 'mycomputer'].map(byId)

// Cascade ouverte au survol : « Tous les programmes », « Documents récents »
// ou « Se connecter à ». null = aucune.
const openCascade = ref<'progs' | 'recent' | 'connect' | null>(null)

// Colonne de droite : libellés façon XP qui ouvrent les apps du portfolio.
const places = [
  { label: 'Mes projets', icon: '/xp/start/mydocs.png', app: 'projects' },
  { label: 'Mes compétences', icon: '/xp/start/mymusic.png', app: 'controlpanel' },
  { label: 'Me contacter', icon: '/xp/start/mypics.png', app: 'contact' },
  { label: 'Poste de travail', icon: '/xp/start/computer.png', app: 'mycomputer' },
]
const tools = [
  { label: 'Panneau de configuration', icon: '/xp/start/controll.png', app: 'controlpanel' },
  { label: 'Aide et support', icon: '/xp/start/help.png', app: 'help' },
  { label: 'Rechercher', icon: '/xp/start/search.png', app: null },
  { label: 'Exécuter…', icon: '/xp/start/run.png', app: 'terminal' },
]

function pick(appId: string | null) {
  const app = appId ? apps.find((a) => a.id === appId) : undefined
  emit('close')
  if (app) emit('open', app)
  else showError() // app non implémentée → « Application not found »
}
</script>

<template>
  <div class="start-menu" @pointerdown.stop>
    <!-- En-tête utilisateur -->
    <div class="head">
      <span class="pp"><img :src="avatarSrc" alt="" @error="avatarFallback" /></span>
      <span class="who">{{ profile.name }}</span>
    </div>

    <div class="body">
      <div class="seam"></div>
      <!-- Colonne gauche -->
      <div class="left">
        <ul class="pinned">
          <li
            v-for="app in pinned"
            :key="app.id"
            class="item bold"
            @mouseenter="openCascade = null"
            @click="emit('open', app)"
          >
            <img :src="app.icon" alt="" />
            <span class="lines">
              <b>{{ app.label }}</b>
              <small>{{ app.title.split('—')[1]?.trim() || 'Application' }}</small>
            </span>
          </li>
        </ul>
        <div class="sep"></div>
        <ul class="freq">
          <li
            v-for="app in frequent"
            :key="app.id"
            class="item"
            @mouseenter="openCascade = null"
            @click="emit('open', app)"
          >
            <img :src="app.icon" alt="" />
            <span>{{ app.label }}</span>
          </li>
        </ul>
        <div class="sep"></div>
        <div
          class="allprogs"
          :class="{ active: openCascade === 'progs' }"
          @mouseenter="openCascade = 'progs'"
        >
          <span>Tous les programmes</span>
          <img src="/xp/start/greenarrow.png" alt="" />
          <StartSubMenu
            v-if="openCascade === 'progs'"
            class="cascade-pop progs-pop"
            :entries="allProgramsMenu"
            @pick="pick"
          />
        </div>
      </div>

      <!-- Colonne droite -->
      <div class="right">
        <ul>
          <li
            v-for="p in places"
            :key="p.label"
            class="item bold"
            :class="{ unavailable: !p.app }"
            @mouseenter="openCascade = null"
            @click="pick(p.app)"
          >
            <img :src="p.icon" alt="" />
            <span>{{ p.label }}</span>
          </li>
          <!-- Documents récents : cascade -->
          <li
            class="item bold cascade"
            :class="{ active: openCascade === 'recent' }"
            @mouseenter="openCascade = 'recent'"
          >
            <img src="/xp/winxp-icons/301(32x32).png" alt="" />
            <span>Documents récents</span>
            <i class="r-arrow"></i>
            <StartSubMenu
              v-if="openCascade === 'recent'"
              class="cascade-pop right-pop"
              :entries="recentDocumentsMenu"
              @pick="pick"
            />
          </li>
        </ul>
        <div class="sep light"></div>
        <ul>
          <li
            v-for="t in tools"
            :key="t.label"
            class="item"
            :class="{ unavailable: !t.app }"
            @mouseenter="openCascade = null"
            @click="pick(t.app)"
          >
            <img :src="t.icon" alt="" />
            <span>{{ t.label }}</span>
          </li>
          <!-- Se connecter à : cascade -->
          <li
            class="item cascade"
            :class="{ active: openCascade === 'connect' }"
            @mouseenter="openCascade = 'connect'"
          >
            <img src="/xp/winxp-icons/309(32x32).png" alt="" />
            <span>Se connecter à</span>
            <i class="r-arrow"></i>
            <StartSubMenu
              v-if="openCascade === 'connect'"
              class="cascade-pop right-pop"
              :entries="connectToMenu"
              @pick="pick"
            />
          </li>
        </ul>
      </div>
    </div>

    <!-- Pied : fermer la session / arrêter -->
    <div class="foot">
      <button class="foot-btn" @click="emit('logoff')">
        <span class="ico"><img src="/xp/start/logoff.png" alt="" /></span>
        <span>Fermer la session</span>
      </button>
      <button class="foot-btn" @click="emit('logoff')">
        <span class="ico"><img src="/xp/start/turnoff.png" alt="" /></span>
        <span>Arrêter l'ordinateur</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.start-menu {
  position: absolute;
  left: 0;
  bottom: 30px;
  width: 386px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  border: 1px solid #0831d9;
  border-bottom: none;
  border-radius: 8px 8px 0 0;
  /* visible : laisse les sous-menus en cascade déborder hors du menu */
  overflow: visible;
  box-shadow: 3px -3px 14px rgba(0, 0, 0, 0.45);
  font-family: Tahoma, 'Segoe UI', sans-serif;
  user-select: none;
}

/* En-tête */
.head {
  height: 60px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
  color: #fff;
  background: linear-gradient(180deg, #3f88e8 0%, #2566cf 8%, #1f5fce 55%, #1a52bb 100%);
  border-bottom: 2px solid #114ec9;
  /* arrondi conservé sur l'en-tête maintenant que le menu déborde */
  border-radius: 7px 7px 0 0;
}
.pp {
  width: 42px;
  height: 42px;
  border: 1px solid #fff;
  border-radius: 4px;
  overflow: hidden;
  background: #cfe0f5;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pp img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.who {
  font-size: 16px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}

/* Corps deux colonnes */
.body {
  display: flex;
  position: relative;
  border-left: 2px solid #0831d9;
  border-right: 2px solid #0831d9;
}
.seam {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(to right, transparent, #e4a668, transparent);
}
.left {
  width: 52%;
  background: #fff;
  padding: 6px 0;
}
.right {
  width: 48%;
  background: #d3e5fa;
  padding: 6px 0;
  border-left: 1px solid #aac6ec;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}
.item {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 12px;
  color: #0a1835;
}
.item.bold {
  font-weight: bold;
}
.item:hover {
  background: #2f71cd;
  color: #fff;
}
/* Élément non disponible (pas encore implémenté) : légèrement grisé */
.item.unavailable {
  color: #9a9a9a;
}
.item.unavailable img {
  opacity: 0.4;
}
.item.unavailable:hover {
  color: #fff;
}
.item.unavailable:hover img {
  opacity: 1;
}
.left .item img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
.right .item img {
  width: 22px;
  height: 22px;
  object-fit: contain;
}
.lines {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}
.lines small {
  font-weight: 400;
  opacity: 0.65;
}
.item:hover .lines small {
  opacity: 0.85;
}

.sep {
  height: 1px;
  margin: 4px 8px;
  background: linear-gradient(to right, transparent, #b9c4d6, transparent);
}
.sep.light {
  background: linear-gradient(to right, transparent, #9bb6dd, transparent);
}

.allprogs {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 6px 12px 2px;
  font-size: 12px;
  font-weight: bold;
  color: #0a1835;
  cursor: pointer;
}
.allprogs.active {
  background: #2f71cd;
  color: #fff;
}
.allprogs img {
  width: 16px;
  height: 16px;
}

/* --- Cascades (Tous les programmes / Documents récents / Se connecter à) --- */
.item.cascade {
  position: relative;
}
.item.active {
  background: #2f71cd;
  color: #fff;
}
.r-arrow {
  margin-left: auto;
  width: 0;
  height: 0;
  border: 4px solid transparent;
  border-right: 0;
  border-left-color: #00136b;
}
.item.cascade.active .r-arrow {
  border-left-color: #fff;
}
.cascade-pop {
  position: absolute;
  z-index: 10001;
}
/* « Tous les programmes » : s'ouvre vers la droite, calé en bas du bouton. */
.progs-pop {
  left: 100%;
  bottom: 0;
}
/* Items de droite : sous-menu à droite de la ligne, calé en bas. */
.right-pop {
  left: 100%;
  bottom: 0;
}

/* Pied */
.foot {
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 14px;
  padding: 0 12px;
  background: linear-gradient(180deg, #3f88e8 0%, #2566cf 10%, #1f5fce 60%, #1a52bb 100%);
  border-top: 1px solid #5e97e6;
}
.foot-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 12px;
  cursor: pointer;
}
.foot-btn .ico {
  width: 24px;
  height: 24px;
  background: #fff;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.foot-btn .ico img {
  width: 20px;
  height: 20px;
}
.foot-btn:active .ico {
  opacity: 0.7;
}
</style>
