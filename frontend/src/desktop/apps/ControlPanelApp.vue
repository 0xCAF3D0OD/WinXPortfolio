<script setup lang="ts">
import { ref, computed, inject } from 'vue'
import { skills, projects } from '../../portfolio'

// Panneau de configuration façon Windows XP (vue par catégories « Pick a
// category »), dont le contenu est la stack technique de Kevin : chaque groupe
// de compétences = une catégorie cliquable menant à son détail (technos +
// projets qui ont nécessité ces compétences).
const openApp = inject<(id: string) => void>('openApp', () => {})
function openExternal(url: string) {
  window.open(url, '_blank', 'noopener')
}

// Une icône XP par groupe de la stack (mappée par nom).
const groupIcons: Record<string, string> = {
  Cloud: '/xp/windowsIcons/earth.png',
  IaC: '/xp/windowsIcons/300(32x32).png',
  Conteneurs: '/xp/windowsIcons/676(32x32).png',
  'CI/CD': '/xp/windowsIcons/367(32x32).png',
  Observabilité: '/xp/windowsIcons/299(32x32).png',
  Langages: '/xp/icons/notepad(32x32).png',
}
const fallbackIcon = '/xp/windowsIcons/358(32x32).png'

interface Category {
  title: string
  items: string[]
  desc: string
  icon: string
}
const categories: Category[] = skills.map((s) => ({
  title: s.group,
  items: s.items,
  desc: s.items.join(', '),
  icon: groupIcons[s.group] || fallbackIcon,
}))

// Projets dont la stack recoupe les technologies d'un groupe.
const norm = (s: string) => s.toLowerCase().trim()
function projectsFor(items: string[]) {
  const wanted = items.map(norm)
  return projects.filter((p) =>
    p.stack.some((tech) => {
      const t = norm(tech)
      return wanted.some((it) => t.includes(it) || it.includes(t))
    }),
  )
}

const view = ref<'category' | 'classic' | 'detail'>('category')
let prevView: 'category' | 'classic' = 'category'
const selected = ref<Category | null>(null)
const detailProjects = computed(() => (selected.value ? projectsFor(selected.value.items) : []))

// Recherche (loupe) : filtre les catégories par nom ou technologie.
const searchOpen = ref(false)
const query = ref('')
function toggleSearch() {
  searchOpen.value = !searchOpen.value
  if (!searchOpen.value) query.value = ''
  else if (view.value === 'detail') view.value = prevView
}
const shownCategories = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return categories
  return categories.filter(
    (c) => c.title.toLowerCase().includes(q) || c.items.some((i) => i.toLowerCase().includes(q)),
  )
})

function openGroup(c: Category) {
  selected.value = c
  if (view.value !== 'detail') prevView = view.value
  view.value = 'detail'
}
function goBack() {
  view.value = prevView
}
function toggleClassic() {
  view.value = view.value === 'classic' ? 'category' : 'classic'
}
</script>

<template>
  <div class="cp">
    <!-- Barre de fonctions -->
    <div class="cp-funcbar">
      <div class="fb-btn" :class="{ disabled: view !== 'detail' }" @click="view === 'detail' && goBack()">
        <img src="/xp/windowsIcons/back.png" alt="" /><span>Précédent</span><i class="fb-arrow"></i>
      </div>
      <div class="fb-btn disabled">
        <img src="/xp/windowsIcons/forward.png" alt="" /><i class="fb-arrow"></i>
      </div>
      <div class="fb-btn"><img class="norm" src="/xp/windowsIcons/up.png" alt="Dossier parent" /></div>
      <div class="fb-sep"></div>
      <div class="fb-btn" :class="{ active: searchOpen }" @click="toggleSearch">
        <img class="norm" src="/xp/windowsIcons/299(32x32).png" alt="" /><span>Rechercher</span>
      </div>
      <div class="fb-btn">
        <img class="norm" src="/xp/windowsIcons/337(32x32).png" alt="" /><span>Dossiers</span>
      </div>
    </div>

    <!-- Barre de recherche -->
    <div v-if="searchOpen" class="cp-search">
      <img src="/xp/windowsIcons/299(32x32).png" alt="" />
      <input v-model="query" type="text" placeholder="Rechercher une technologie ou une catégorie…" />
      <button v-if="query" class="cp-search-clear" @click="query = ''">✕</button>
    </div>

    <!-- Barre d'adresse -->
    <div class="cp-address">
      <span class="lbl">Adresse</span>
      <div class="path">
        <img src="/xp/windowsIcons/300(32x32).png" class="mini" alt="" /> Panneau de configuration{{
          view === 'detail' && selected ? ' \\ ' + selected.title : ''
        }}
      </div>
      <button class="go"><img src="/xp/ie/go.png" class="mini" alt="" /> Aller</button>
    </div>

    <div class="cp-body">
      <!-- Volet latéral -->
      <aside class="cp-side">
        <section class="cp-card">
          <p class="cp-card-title">Panneau de configuration</p>
          <a v-if="view === 'detail'" class="cp-link" @click="goBack">
            <img src="/xp/windowsIcons/back.png" alt="" />
            <span>Précédent</span>
          </a>
          <a class="cp-link" @click="toggleClassic">
            <img src="/xp/windowsIcons/337(32x32).png" alt="" />
            <span>{{
              view === 'classic'
                ? "Revenir à l'affichage des catégories"
                : "Basculer vers l'affichage classique"
            }}</span>
          </a>
        </section>
        <section class="cp-card">
          <p class="cp-card-title">Voir aussi</p>
          <a class="cp-link"><img src="/xp/windowsIcons/322(16x16).png" alt="" /><span>Windows Update</span></a>
          <a class="cp-link" @click="openApp('help')">
            <img src="/xp/windowsIcons/747(16x16).png" alt="" /><span>Aide et support</span>
          </a>
        </section>
      </aside>

      <!-- Contenu -->
      <div class="cp-main">
        <!-- Vue par catégories -->
        <template v-if="view === 'category'">
          <h1 class="cp-h1">{{ query ? 'Résultats de la recherche' : 'Choisir une catégorie' }}</h1>
          <p class="cp-sub">Ma stack technique, du provisioning à l'observabilité.</p>
          <div class="cats">
            <div v-for="c in shownCategories" :key="c.title" class="cat" @click="openGroup(c)">
              <img :src="c.icon" alt="" />
              <span class="cat-text">
                <b>{{ c.title }}</b>
                <small>{{ c.desc }}</small>
              </span>
            </div>
          </div>
          <p v-if="!shownCategories.length" class="cp-noresult">
            Aucune catégorie ne correspond à « {{ query }} ».
          </p>
        </template>

        <!-- Vue classique (grille d'icônes) -->
        <template v-else-if="view === 'classic'">
          <div class="classic">
            <button v-for="c in shownCategories" :key="c.title" class="tile" @click="openGroup(c)">
              <img :src="c.icon" alt="" />
              <span>{{ c.title }}</span>
            </button>
            <p v-if="!shownCategories.length" class="cp-noresult dark">
              Aucune catégorie ne correspond à « {{ query }} ».
            </p>
          </div>
        </template>

        <!-- Vue détail d'un groupe -->
        <template v-else-if="selected">
          <p class="cp-crumbs">
            <a @click="goBack">Panneau de configuration</a>
            <span> › {{ selected.title }}</span>
          </p>
          <div class="detail-panel">
            <div class="detail-head">
              <img :src="selected.icon" alt="" />
              <div>
                <h2 class="detail-title">{{ selected.title }}</h2>
                <p class="detail-techs">{{ selected.items.join(' · ') }}</p>
              </div>
            </div>

            <h3 class="detail-h3">Projets ayant nécessité ces compétences</h3>
            <ul v-if="detailProjects.length" class="proj-list">
              <li v-for="p in detailProjects" :key="p.name">
                <b>{{ p.name }}</b>
                <span class="proj-stack">{{ p.stack.join(', ') }}</span>
                <span class="proj-desc">{{ p.desc }}</span>
                <a class="proj-link" @click="openExternal(p.url)">Voir le dépôt sur GitHub ↗</a>
              </li>
            </ul>
            <p v-else class="detail-empty">Aucun projet listé n'utilise (encore) ces technologies.</p>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cp {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #111;
}

/* Barre de fonctions */
.cp-funcbar {
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
  cursor: pointer;
}
.fb-btn:not(.disabled):hover {
  border-color: rgba(0, 0, 0, 0.15);
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

/* Barre d'adresse */
.cp-address {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid #d6d3ce;
  background: #f1efe7;
  flex-shrink: 0;
}
.cp-address .lbl {
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
  cursor: pointer;
}
.go:hover {
  border-color: rgba(0, 0, 0, 0.15);
}
.mini {
  width: 14px;
  height: 14px;
}
.fb-btn.active {
  border-color: rgba(0, 0, 0, 0.2);
  background: #dbe6ff;
}

/* Barre de recherche */
.cp-search {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  background: #eef3fb;
  border-bottom: 1px solid #c7d4ea;
  flex-shrink: 0;
}
.cp-search img {
  width: 16px;
  height: 16px;
}
.cp-search input {
  flex: 1;
  font-size: 12px;
  padding: 2px 5px;
  border: 1px solid #7f9db9;
}
.cp-search-clear {
  border: 1px solid #9aa0a6;
  background: #fff;
  cursor: pointer;
  font-size: 11px;
  line-height: 1;
  padding: 2px 6px;
}
.cp-noresult {
  margin: 14px 2px;
  font-size: 12px;
  color: #15317e;
}
.cp-noresult.dark {
  color: #444;
}

/* Corps */
.cp-body {
  flex: 1;
  min-height: 0;
  display: flex;
  overflow: hidden;
  background: linear-gradient(135deg, #7491de 0%, #5577ce 60%, #4567c4 100%);
}
.cp-side {
  width: 200px;
  flex-shrink: 0;
  padding: 12px 10px;
  overflow: auto;
}
.cp-card {
  background: #fff;
  border-radius: 4px;
  margin-bottom: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}
.cp-card-title {
  margin: 0;
  padding: 5px 9px;
  font-size: 12px;
  font-weight: bold;
  color: #0c327d;
  background: linear-gradient(to right, #eef2ff, #c3d3ff);
}
.cp-link {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 6px 9px;
  font-size: 12px;
  color: #0c327d;
  cursor: pointer;
}
.cp-link img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}
.cp-link:hover span {
  text-decoration: underline;
  color: #2b72ff;
}

/* Zone principale */
.cp-main {
  flex: 1;
  min-width: 0;
  padding: 18px 22px;
  overflow: auto;
}
.cp-h1 {
  margin: 0 0 2px;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
}
.cp-sub {
  margin: 0 0 18px;
  font-size: 12px;
  color: #eaf0ff;
}

/* Catégories cliquables */
.cats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 26px;
}
.cat {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  cursor: pointer;
  border-radius: 4px;
  padding: 4px;
}
.cat:hover {
  background: rgba(255, 255, 255, 0.18);
}
.cat img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}
.cat-text {
  display: flex;
  flex-direction: column;
  line-height: 1.35;
}
.cat-text b {
  font-size: 14px;
  color: #15317e;
}
.cat:hover .cat-text b {
  text-decoration: underline;
}
.cat-text small {
  font-size: 11px;
  color: #e9efff;
}

/* Vue classique (grille façon XP) */
.classic {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 12px 4px;
  background: #fff;
  border: 1px solid #b9c8e3;
  border-radius: 3px;
  padding: 14px 10px;
  min-height: 100%;
}
.tile {
  width: 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
  padding: 5px 3px;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
}
.tile:hover {
  background: #e8f0fe;
  border-color: #b6c8e8;
}
.tile img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.tile span {
  font-size: 11px;
  line-height: 1.2;
  color: #1a1a1a;
}

/* Vue détail */
.cp-crumbs {
  margin: 0 0 10px;
  font-size: 12px;
  color: #eaf0ff;
}
.cp-crumbs a {
  color: #fff;
  text-decoration: underline;
  cursor: pointer;
}
.detail-panel {
  background: #fff;
  border: 1px solid #b9c8e3;
  border-radius: 4px;
  padding: 14px 16px;
}
.detail-head {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #e3e9f5;
  padding-bottom: 10px;
  margin-bottom: 12px;
}
.detail-head img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}
.detail-title {
  margin: 0;
  font-size: 18px;
  color: #15317e;
}
.detail-techs {
  margin: 2px 0 0;
  font-size: 12px;
  color: #555;
}
.detail-h3 {
  margin: 0 0 8px;
  font-size: 13px;
  color: #15317e;
}
.proj-list {
  margin: 0;
  padding: 0;
  list-style: none;
}
.proj-list li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 0;
  border-top: 1px solid #eef1f7;
}
.proj-list li:first-child {
  border-top: none;
}
.proj-list b {
  font-size: 13px;
  color: #1c3e8f;
}
.proj-stack {
  font-size: 11px;
  color: #2b72ff;
}
.proj-desc {
  font-size: 12px;
  color: #333;
  line-height: 1.45;
}
.proj-link {
  font-size: 12px;
  color: #0c327d;
  cursor: pointer;
  align-self: flex-start;
}
.proj-link:hover {
  text-decoration: underline;
}
.detail-empty {
  margin: 0;
  font-size: 12px;
  color: #666;
}
</style>
