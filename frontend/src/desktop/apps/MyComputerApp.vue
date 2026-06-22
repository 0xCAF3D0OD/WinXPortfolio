<script setup lang="ts">
import { inject } from 'vue'

const openApp = inject<(id: string) => void>('openApp', () => {})

const drives = [
  { name: 'Disque local (C:)', icon: '/xp/icons/computer.ico', sub: 'NTFS', free: '34,2 Go libres sur 80,0 Go' },
  { name: 'Données (D:)', icon: '/xp/icons/computer.ico', sub: 'NTFS', free: '120 Go libres sur 250 Go' },
]
</script>

<template>
  <div class="mc">
    <!-- Barre d'adresse -->
    <div class="addressbar">
      <span class="lbl">Adresse</span>
      <div class="path"><img src="/xp/icons/computer.ico" class="mini" alt="" /> Poste de travail</div>
    </div>

    <div class="body">
      <!-- Volet latéral -->
      <aside class="side">
        <div class="panel">
          <p class="panel-title">Gestion du système</p>
          <a @click="openApp('about')">Afficher les informations système</a>
          <a @click="openApp('skills')">Compétences installées</a>
          <a @click="openApp('iexplorer')">Ouvrir WikiDK</a>
        </div>
        <div class="panel">
          <p class="panel-title">Autres emplacements</p>
          <a @click="openApp('projects')">Mes projets</a>
          <a @click="openApp('guestbook')">Me contacter</a>
        </div>
      </aside>

      <!-- Contenu -->
      <div class="content">
        <p class="group">Fichiers stockés sur cet ordinateur</p>
        <div class="items">
          <button class="item" @click="openApp('projects')">
            <img src="/xp/start/mydocs.png" alt="" />
            <span>Mes projets</span>
          </button>
          <button class="item" @click="openApp('about')">
            <img src="/xp/icons/notepad.svg" alt="" />
            <span>À propos de Kevin</span>
          </button>
        </div>

        <p class="group">Disques durs</p>
        <div class="items">
          <button v-for="d in drives" :key="d.name" class="item drive">
            <img :src="d.icon" alt="" />
            <span class="dn">{{ d.name }}</span>
            <span class="ds">{{ d.free }}</span>
            <span class="bar"><i :style="{ width: '58%' }"></i></span>
          </button>
        </div>
      </div>
    </div>

    <div class="statusbar">{{ drives.length + 2 }} objet(s)</div>
  </div>
</template>

<style scoped>
.mc {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
}
.addressbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid #d6d3ce;
  background: #f1efe7;
  flex-shrink: 0;
}
.addressbar .lbl {
  font-size: 12px;
  color: #555;
}
.path {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  background: #fff;
  border: 1px solid #9aa0a6;
  padding: 2px 6px;
  font-size: 12px;
}
.mini {
  width: 14px;
  height: 14px;
}
.body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
}
.side {
  width: 180px;
  flex-shrink: 0;
  background: linear-gradient(to bottom, #6f96e6, #5b80d6);
  padding: 8px;
  overflow: auto;
}
.panel {
  background: #f5f8ff;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 6px 8px;
}
.panel-title {
  margin: 0 0 5px;
  font-size: 12px;
  font-weight: bold;
  color: #1c4587;
  border-bottom: 1px solid #cdddf2;
  padding-bottom: 3px;
}
.panel a {
  display: block;
  font-size: 12px;
  color: #1c4587;
  cursor: pointer;
  padding: 2px 0;
}
.panel a:hover {
  color: #d35400;
  text-decoration: underline;
}
.content {
  flex: 1;
  overflow: auto;
  padding: 10px 14px;
}
.group {
  font-size: 13px;
  font-weight: bold;
  color: #1c4587;
  border-bottom: 1px solid #d6e2f5;
  padding-bottom: 3px;
  margin: 8px 0 8px;
}
.items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}
.item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 230px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 3px;
  padding: 6px 8px;
  cursor: pointer;
  text-align: left;
}
.item:hover {
  background: #e8f0fe;
  border-color: #b6c8e8;
}
.item img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}
.item span {
  font-size: 12px;
  color: #111;
}
.item.drive {
  flex-wrap: wrap;
}
.item.drive .dn {
  flex: 1;
  font-weight: bold;
}
.item.drive .ds {
  width: 100%;
  margin-left: 42px;
  color: #777;
  font-size: 11px;
}
.item.drive .bar {
  width: 100%;
  margin-left: 42px;
  height: 8px;
  background: #e3e3e3;
  border: 1px solid #b9b9b9;
  border-radius: 4px;
  overflow: hidden;
}
.item.drive .bar i {
  display: block;
  height: 100%;
  background: linear-gradient(to right, #3aa0ff, #1f6fd0);
}
.statusbar {
  border-top: 1px solid #d6d3ce;
  background: #f1efe7;
  padding: 3px 8px;
  font-size: 11px;
  color: #555;
  flex-shrink: 0;
}
</style>
