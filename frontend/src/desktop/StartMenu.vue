<script setup lang="ts">
import { ref } from 'vue'
import { apps, type AppDef } from './registry'
import { profile } from '../portfolio'

const emit = defineEmits<{ open: [AppDef]; logoff: []; close: [] }>()

const avatarSrc = ref('/xp/login/avatar.jpg')
function avatarFallback() {
  avatarSrc.value = '/xp/login/avatar.ico'
}

const byId = (id: string) => apps.find((a) => a.id === id)!
const pinned = ['terminal', 'about'].map(byId)
const frequent = ['projects', 'skills', 'contact', 'bin'].map(byId)

// Colonne de droite : libellés façon XP qui ouvrent les apps du portfolio.
const places = [
  { label: 'Mes projets', icon: '/xp/start/mydocs.png', app: 'projects' },
  { label: 'Mes compétences', icon: '/xp/start/mymusic.png', app: 'skills' },
  { label: 'Me contacter', icon: '/xp/start/mypics.png', app: 'contact' },
  { label: 'Poste de travail', icon: '/xp/start/computer.png', app: null },
]
const tools = [
  { label: 'Panneau de configuration', icon: '/xp/start/controll.png', app: 'skills' },
  { label: 'Aide et support', icon: '/xp/start/help.png', app: null },
  { label: 'Rechercher', icon: '/xp/start/search.png', app: null },
  { label: 'Exécuter…', icon: '/xp/start/run.png', app: 'terminal' },
]

function pick(appId: string | null) {
  if (appId) emit('open', byId(appId))
  else emit('close')
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
          <li v-for="app in pinned" :key="app.id" class="item bold" @click="emit('open', app)">
            <img :src="app.icon" alt="" />
            <span class="lines">
              <b>{{ app.label }}</b>
              <small>{{ app.title.split('—')[1]?.trim() || 'Application' }}</small>
            </span>
          </li>
        </ul>
        <div class="sep"></div>
        <ul class="freq">
          <li v-for="app in frequent" :key="app.id" class="item" @click="emit('open', app)">
            <img :src="app.icon" alt="" />
            <span>{{ app.label }}</span>
          </li>
        </ul>
        <div class="sep"></div>
        <div class="allprogs">
          <span>Tous les programmes</span>
          <img src="/xp/start/greenarrow.png" alt="" />
        </div>
      </div>

      <!-- Colonne droite -->
      <div class="right">
        <ul>
          <li v-for="p in places" :key="p.label" class="item bold" @click="pick(p.app)">
            <img :src="p.icon" alt="" />
            <span>{{ p.label }}</span>
          </li>
        </ul>
        <div class="sep light"></div>
        <ul>
          <li v-for="t in tools" :key="t.label" class="item" @click="pick(t.app)">
            <img :src="t.icon" alt="" />
            <span>{{ t.label }}</span>
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
  overflow: hidden;
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
.allprogs img {
  width: 16px;
  height: 16px;
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
