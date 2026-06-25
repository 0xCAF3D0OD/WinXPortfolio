<script setup lang="ts">
import { inject, ref, computed, watch } from 'vue'
import { profile } from '../../portfolio'
import { fsTree, fsPath, type FsNode } from '../fileTree'

// Explorer XP générique piloté par fileTree.ts : le Poste de travail, les
// disques et chaque dossier (Projets…) utilisent ce même composant. La prop
// `start` indique le nœud de départ.
const props = withDefaults(defineProps<{ start?: string }>(), { start: 'computer' })

const openApp = inject<(id: string) => void>('openApp', () => {})
// Fenêtre hôte (fournie par XpWindow) : on met à jour son titre / icône au fil
// de la navigation, comme un vrai Explorer.
const win = inject<{ title: string; icon: string } | null>('win', null)

// --- Navigation (historique façon Précédent / Suivant / Dossier parent) ---
const history = ref<string[]>([props.start])
const index = ref(0)
const currentId = computed(() => history.value[index.value]!)
const node = computed<FsNode>(() => fsTree[currentId.value]!)
const children = computed<FsNode[]>(() =>
  (node.value.children ?? []).map((id) => fsTree[id]).filter(Boolean) as FsNode[],
)

function navigate(id: string) {
  history.value = [...history.value.slice(0, index.value + 1), id]
  index.value = history.value.length - 1
}
function back() {
  if (index.value > 0) index.value--
}
function forward() {
  if (index.value < history.value.length - 1) index.value++
}
function up() {
  if (node.value.parent) navigate(node.value.parent)
}
const canBack = computed(() => index.value > 0)
const canForward = computed(() => index.value < history.value.length - 1)
const canUp = computed(() => !!node.value.parent)

// Ouvre un nœud : conteneur → on y entre ; application → fenêtre ; lien → onglet.
function activate(n: FsNode) {
  if (n.type === 'computer' || n.type === 'drive' || n.type === 'folder') navigate(n.id)
  else if (n.type === 'app' && n.open) openApp(n.open)
  else if (n.type === 'link' && n.href) window.open(n.href, '_blank', 'noopener')
}

// Titre / icône de la fenêtre suivent le dossier courant.
watch(
  node,
  (n) => {
    if (win) {
      win.title = n.name
      win.icon = n.icon
    }
  },
  { immediate: true },
)

// --- Recherche (loupe) : filtre le contenu du dossier courant ---
const searchOpen = ref(false)
const query = ref('')
function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) query.value = ''
}
const q = computed(() => query.value.trim().toLowerCase())
const shown = computed(() =>
  q.value ? children.value.filter((c) => c.name.toLowerCase().includes(q.value)) : children.value,
)

// Groupes (uniquement à la racine Poste de travail, comme le vrai XP)
const grouped = computed(() => node.value.type === 'computer' && !q.value)
const gFiles = computed(() => shown.value.filter((c) => c.type === 'folder' || c.type === 'app'))
const gDrives = computed(() => shown.value.filter((c) => c.type === 'drive'))
const gDevices = computed(() => shown.value.filter((c) => c.type === 'device'))
const gLinks = computed(() => shown.value.filter((c) => c.type === 'link'))
const noResults = computed(() => !!q.value && shown.value.length === 0)

const linkedinUrl = profile.linkedin.startsWith('http')
  ? profile.linkedin
  : `https://${profile.linkedin}`
</script>

<template>
  <div class="mc">
    <!-- Barre de fonctions : Précédent / Suivant / Dossier parent / Rechercher / Dossiers -->
    <div class="funcbar">
      <div class="fb-btn" :class="{ disabled: !canBack }" @click="back">
        <img src="/xp/windowsIcons/back.png" alt="" />
        <span>Précédent</span>
        <i class="fb-arrow"></i>
      </div>
      <div class="fb-btn" :class="{ disabled: !canForward }" @click="forward">
        <img src="/xp/windowsIcons/forward.png" alt="" />
        <i class="fb-arrow"></i>
      </div>
      <div class="fb-btn" :class="{ disabled: !canUp }" @click="up">
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
      <input v-model="query" type="text" placeholder="Rechercher dans ce dossier…" />
      <button v-if="query" class="mc-search-clear" @click="query = ''">✕</button>
    </div>

    <!-- Barre d'adresse -->
    <div class="addressbar">
      <span class="lbl">Adresse</span>
      <div class="path"><img :src="node.icon" class="mini" alt="" /> {{ fsPath(currentId) }}</div>
      <button class="go inert"><img src="/xp/ie/go.png" class="mini" alt="" /> Aller</button>
    </div>

    <div class="body">
      <!-- Volet latéral -->
      <aside class="side">
        <div v-if="canUp" class="panel">
          <p class="panel-title">Gestion des dossiers</p>
          <a @click="up">
            <img src="/xp/win/up.png" alt="" />
            <span class="ptxt">Remonter d'un niveau</span>
          </a>
          <a @click="navigate('computer')">
            <img src="/xp/win/computer16.png" alt="" />
            <span class="ptxt">Poste de travail</span>
          </a>
        </div>
        <div class="panel">
          <p class="panel-title">Autres emplacements</p>
          <a @click="openApp('controlpanel')">
            <img src="/xp/windowsIcons/300(16x16).png" alt="" />
            <span class="ptxt">Panneau de configuration</span>
          </a>
          <a @click="openApp('iexplorer')">
            <img src="/xp/windowsIcons/ie.png" alt="" />
            <span class="ptxt">Ouvrir WikiDK</span>
          </a>
          <a @click="openApp('guestbook')">
            <img src="/xp/windowsIcons/mail.png" alt="" />
            <span class="ptxt">Me contacter</span>
          </a>
        </div>
        <div class="panel">
          <p class="panel-title">Détails</p>
          <p class="detail-name">{{ node.name }}</p>
          <p class="detail-role">
            <template v-if="node.type === 'drive'">{{ node.free }}</template>
            <template v-else>{{ profile.role }}</template>
          </p>
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
        <!-- Racine Poste de travail : groupes façon XP -->
        <template v-if="grouped">
          <template v-if="gFiles.length">
            <p class="group">Fichiers stockés sur cet ordinateur</p>
            <div class="items">
              <button v-for="f in gFiles" :key="f.id" class="item" @click="activate(f)">
                <img :src="f.icon" alt="" />
                <span>{{ f.name }}</span>
              </button>
            </div>
          </template>

          <template v-if="gDrives.length">
            <p class="group">Disques durs</p>
            <div class="items">
              <button v-for="d in gDrives" :key="d.id" class="item drive" @click="activate(d)">
                <img :src="d.icon" alt="" />
                <span class="dn">{{ d.name }}</span>
                <span class="ds">{{ d.free }}</span>
                <span class="bar"><i :style="{ width: (d.pct ?? 0) + '%' }"></i></span>
              </button>
            </div>
          </template>

          <template v-if="gDevices.length">
            <p class="group">Périphériques utilisant des supports amovibles</p>
            <div class="items">
              <button v-for="dev in gDevices" :key="dev.id" class="item">
                <img :src="dev.icon" alt="" />
                <span>{{ dev.name }}</span>
              </button>
            </div>
          </template>

          <template v-if="gLinks.length">
            <p class="group">À propos de moi :)</p>
            <div class="items">
              <button v-for="a in gLinks" :key="a.id" class="item me" @click="activate(a)">
                <img :src="a.icon" alt="" />
                <span>{{ a.name }}</span>
              </button>
            </div>
          </template>
        </template>

        <!-- Dossier ordinaire : grille de mosaïques (même format que C:) -->
        <template v-else>
          <div class="tiles">
            <button
              v-for="c in shown"
              :key="c.id"
              class="tile"
              @click="activate(c)"
            >
              <img :src="c.icon" alt="" />
              <span class="tname">{{ c.name }}</span>
              <span v-if="c.detail" class="tdesc">{{ c.detail }}</span>
            </button>
          </div>
        </template>

        <p v-if="noResults" class="mc-noresult">Aucun élément ne correspond à « {{ query }} ».</p>
      </div>
    </div>

    <div class="statusbar">{{ shown.length }} objet(s)</div>
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
  object-fit: contain;
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

/* Vue mosaïque (contenu d'un dossier ordinaire, ex. Projets) */
.tiles {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-content: flex-start;
}
.tile {
  display: grid;
  grid-template-columns: 32px 1fr;
  grid-template-rows: auto auto;
  column-gap: 8px;
  align-items: center;
  width: 240px;
  padding: 6px 8px;
  border: 1px solid transparent;
  border-radius: 3px;
  background: transparent;
  cursor: pointer;
  text-align: left;
}
.tile:hover {
  background: #e8f0fe;
  border-color: #b6c8e8;
}
.tile img {
  grid-row: 1 / span 2;
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.tile .tname {
  font-size: 12px;
  font-weight: bold;
  color: #1c4587;
  align-self: end;
}
.tile .tdesc {
  font-size: 11px;
  color: #666;
  align-self: start;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
