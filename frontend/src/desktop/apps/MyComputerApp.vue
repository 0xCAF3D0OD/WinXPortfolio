<script setup lang="ts">
import { inject, ref, computed } from 'vue'
import { profile } from '../../portfolio'

const openApp = inject<(id: string) => void>('openApp', () => {})

const linkedinUrl = profile.linkedin.startsWith('http')
  ? profile.linkedin
  : `https://${profile.linkedin}`

const files = [
  { name: 'Mes projets', icon: '/xp/win/folder.png', app: 'projects' },
  { name: 'À propos de Kevin', icon: '/xp/win/folder.png', app: 'about' },
]
const drives = [
  { name: 'Disque local (C:)', icon: '/xp/win/disk.png', free: '34,2 Go libres sur 80,0 Go', pct: 58 },
  { name: 'Données (D:)', icon: '/xp/win/disk.png', free: '120 Go libres sur 250 Go', pct: 52 },
]
const devices = [{ name: 'Lecteur CD (E:)', icon: '/xp/win/cd.png' }]
const aboutMe: { name: string; icon: string; href?: string; app?: string }[] = [
  { name: 'GitHub', icon: '/xp/windowsIcons/earth.png', href: profile.github },
  { name: 'LinkedIn', icon: '/xp/windowsIcons/links.png', href: linkedinUrl },
  { name: 'Me contacter', icon: '/xp/start/emailoutlook.png', app: 'contact' },
]

// Recherche (loupe) : filtre les éléments de cet ordinateur par nom.
const searchOpen = ref(false)
const query = ref('')
function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) query.value = ''
}
const has = (name: string) => name.toLowerCase().includes(query.value.trim().toLowerCase())
const fFiles = computed(() => files.filter((f) => has(f.name)))
const fDrives = computed(() => drives.filter((d) => has(d.name)))
const fDevices = computed(() => devices.filter((d) => has(d.name)))
const fAbout = computed(() => aboutMe.filter((a) => has(a.name)))
const noResults = computed(
  () =>
    !!query.value.trim() &&
    !fFiles.value.length &&
    !fDrives.value.length &&
    !fDevices.value.length &&
    !fAbout.value.length,
)
</script>

<template>
  <div class="mc">
    <!-- Barre de fonctions (Précédent / Suivant / Dossier parent / Rechercher / Dossiers) -->
    <div class="funcbar">
      <div class="fb-btn disabled">
        <img src="/xp/windowsIcons/back.png" alt="" />
        <span>Précédent</span>
        <i class="fb-arrow"></i>
      </div>
      <div class="fb-btn disabled">
        <img src="/xp/windowsIcons/forward.png" alt="" />
        <i class="fb-arrow"></i>
      </div>
      <div class="fb-btn inert">
        <img class="norm" src="/xp/win/up.png" alt="Dossier parent" />
      </div>
      <div class="fb-sep"></div>
      <div class="fb-btn" :class="{ active: searchOpen }" @click="toggleSearch">
        <img class="norm" src="/xp/windowsIcons/299(32x32).png" alt="" />
        <span>Rechercher</span>
      </div>
      <div class="fb-btn inert">
        <img class="norm" src="/xp/win/folders.png" alt="" />
        <span>Dossiers</span>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div v-if="searchOpen" class="mc-search">
      <img src="/xp/windowsIcons/299(32x32).png" alt="" />
      <input v-model="query" type="text" placeholder="Rechercher dans le Poste de travail…" />
      <button v-if="query" class="mc-search-clear" @click="query = ''">✕</button>
    </div>

    <!-- Barre d'adresse -->
    <div class="addressbar">
      <span class="lbl">Adresse</span>
      <div class="path"><img src="/xp/win/computer16.png" class="mini" alt="" /> Poste de travail</div>
      <button class="go inert"><img src="/xp/ie/go.png" class="mini" alt="" /> Aller</button>
    </div>

    <div class="body">
      <!-- Volet latéral -->
      <aside class="side">
        <div class="panel">
          <p class="panel-title">Gestion du système</p>
          <a @click="openApp('about')">
            <img src="/xp/windowsIcons/view-info.ico" alt="" />
            <span class="ptxt">Afficher les informations système</span>
          </a>
          <a @click="openApp('controlpanel')">
            <img src="/xp/windowsIcons/302(16x16).png" alt="" />
            <span class="ptxt">Ajouter ou supprimer des programmes</span>
          </a>
          <a @click="openApp('iexplorer')">
            <img src="/xp/windowsIcons/ie.png" alt="" />
            <span class="ptxt">Ouvrir WikiDK</span>
          </a>
        </div>
        <div class="panel">
          <p class="panel-title">Autres emplacements</p>
          <a @click="openApp('projects')">
            <img src="/xp/windowsIcons/308(16x16).png" alt="" />
            <span class="ptxt">Mes projets</span>
          </a>
          <a @click="openApp('controlpanel')">
            <img src="/xp/windowsIcons/300(16x16).png" alt="" />
            <span class="ptxt">Panneau de configuration</span>
          </a>
          <a @click="openApp('guestbook')">
            <img src="/xp/windowsIcons/mail.png" alt="" />
            <span class="ptxt">Me contacter</span>
          </a>
        </div>
        <div class="panel">
          <p class="panel-title">Détails</p>
          <p class="detail-name">{{ profile.name }}</p>
          <p class="detail-role">{{ profile.role }}</p>
          <a :href="profile.github" target="_blank" rel="noreferrer">
            <img src="/xp/windowsIcons/earth.png" alt="" />
            <span class="ptxt">GitHub</span>
          </a>
          <a :href="linkedinUrl" target="_blank" rel="noreferrer">
            <img src="/xp/windowsIcons/links.png" alt="" />
            <span class="ptxt">LinkedIn</span>
          </a>
        </div>
      </aside>

      <!-- Contenu -->
      <div class="content">
        <template v-if="fFiles.length">
          <p class="group">Fichiers stockés sur cet ordinateur</p>
          <div class="items">
            <button v-for="f in fFiles" :key="f.name" class="item" @click="openApp(f.app)">
              <img :src="f.icon" alt="" />
              <span>{{ f.name }}</span>
            </button>
          </div>
        </template>

        <template v-if="fDrives.length">
          <p class="group">Disques durs</p>
          <div class="items">
            <button v-for="d in fDrives" :key="d.name" class="item drive">
              <img :src="d.icon" alt="" />
              <span class="dn">{{ d.name }}</span>
              <span class="ds">{{ d.free }}</span>
              <span class="bar"><i :style="{ width: d.pct + '%' }"></i></span>
            </button>
          </div>
        </template>

        <template v-if="fDevices.length">
          <p class="group">Périphériques utilisant des supports amovibles</p>
          <div class="items">
            <button v-for="dev in fDevices" :key="dev.name" class="item">
              <img :src="dev.icon" alt="" />
              <span>{{ dev.name }}</span>
            </button>
          </div>
        </template>

        <template v-if="fAbout.length">
          <p class="group">À propos de moi :)</p>
          <div class="items">
            <template v-for="a in fAbout" :key="a.name">
              <a v-if="a.href" class="item me" :href="a.href" target="_blank" rel="noreferrer">
                <img :src="a.icon" alt="" />
                <span>{{ a.name }}</span>
              </a>
              <button v-else class="item me" @click="openApp(a.app!)">
                <img :src="a.icon" alt="" />
                <span>{{ a.name }}</span>
              </button>
            </template>
          </div>
        </template>

        <p v-if="noResults" class="mc-noresult">Aucun élément ne correspond à « {{ query }} ».</p>
      </div>
    </div>

    <div class="statusbar">
      {{ fFiles.length + fDrives.length + fDevices.length + fAbout.length }} objet(s)
    </div>
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

/* Barre de fonctions */
.funcbar {
  display: flex;
  align-items: center;
  gap: 1px;
  height: 34px;
  padding: 1px 4px 0;
  background: linear-gradient(to bottom, #f6f5ee 0%, #e9e6da 100%);
  border-bottom: 1px solid #d6d3ce;
  flex-shrink: 0;
  font-size: 11px;
}
.fb-btn {
  display: flex;
  align-items: center;
  gap: 3px;
  height: 100%;
  padding: 0 5px;
  border: 1px solid transparent;
  border-radius: 3px;
  color: #1a1a1a;
  cursor: pointer;
}
.fb-btn:not(.disabled):hover {
  border-color: rgba(0, 0, 0, 0.15);
  box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.08);
}
.fb-btn.disabled {
  filter: grayscale(1);
  opacity: 0.55;
  cursor: default;
}
.fb-btn img {
  width: 30px;
  height: 30px;
}
.fb-btn img.norm {
  width: 22px;
  height: 22px;
}
.fb-arrow {
  width: 0;
  height: 0;
  border: 3px solid transparent;
  border-bottom: 0;
  border-top-color: #000;
}
.fb-sep {
  width: 1px;
  height: 80%;
  margin: 0 3px;
  background: rgba(0, 0, 0, 0.2);
}
.fb-btn.active {
  border-color: rgba(0, 0, 0, 0.2);
  background: #dbe6ff;
}
/* Boutons inertes (visibles, cliquables, mais sans effet) : logo grisé */
.fb-btn.inert img,
.go.inert img {
  filter: grayscale(1);
  opacity: 0.4;
}

/* Barre de recherche */
.mc-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: #eef3fb;
  border-bottom: 1px solid #c7d4ea;
  flex-shrink: 0;
}
.mc-search img {
  width: 16px;
  height: 16px;
}
.mc-search input {
  flex: 1;
  font-size: 12px;
  padding: 2px 5px;
  border: 1px solid #7f9db9;
}
.mc-search-clear {
  border: 1px solid #9aa0a6;
  background: #fff;
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  padding: 2px 6px;
}
.mc-noresult {
  font-size: 12px;
  color: #555;
  margin: 10px 2px;
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
.go {
  display: flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  padding: 1px 6px;
  font-size: 12px;
  color: #1a1a1a;
  cursor: pointer;
}
.go:hover {
  border-color: rgba(0, 0, 0, 0.15);
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
  display: flex;
  align-items: flex-start;
  gap: 6px;
  font-size: 12px;
  color: #1c4587;
  cursor: pointer;
  padding: 2px 0;
  text-decoration: none;
}
.panel a img {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
  object-fit: contain;
}
.panel a:hover {
  color: #d35400;
}
.panel a:hover .ptxt {
  text-decoration: underline;
}
.detail-name {
  margin: 0;
  font-size: 12px;
  font-weight: bold;
  color: #0a1835;
}
.detail-role {
  margin: 0 0 5px;
  font-size: 11px;
  color: #555;
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
  text-decoration: none;
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
.item.me img {
  width: 26px;
  height: 26px;
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
