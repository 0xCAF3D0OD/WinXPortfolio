<script setup lang="ts">
import { ref, computed } from 'vue'
import { projects, profile } from '../../portfolio'

interface Page {
  url: string
  title: string
  kind: 'home' | 'project'
  projectIndex?: number
}

const home: Page = { url: 'http://portfolio.kevin/accueil', title: 'Portfolio — Accueil', kind: 'home' }

const history = ref<Page[]>([home])
const index = ref(0)
const current = computed(() => history.value[index.value]!)
const address = ref(current.value.url)

function navigate(page: Page) {
  history.value = history.value.slice(0, index.value + 1)
  history.value.push(page)
  index.value = history.value.length - 1
  address.value = page.url
}
function back() {
  if (index.value > 0) index.value--, (address.value = current.value.url)
}
function forward() {
  if (index.value < history.value.length - 1) index.value++, (address.value = current.value.url)
}
function goHome() {
  navigate(home)
}
function openProject(i: number) {
  const p = projects[i]!
  navigate({ url: p.url, title: p.name, kind: 'project', projectIndex: i })
}
function openExternal(url: string) {
  window.open(url, '_blank', 'noopener')
}
// Entrée dans la barre d'adresse : ouvre l'URL réelle dans un nouvel onglet.
function go() {
  let url = address.value.trim()
  if (!url) return
  if (!/^https?:\/\//.test(url) && url.includes('.')) url = 'https://' + url
  if (/^https?:\/\//.test(url)) openExternal(url)
}

const activeProject = computed(() =>
  current.value.kind === 'project' && current.value.projectIndex !== undefined
    ? projects[current.value.projectIndex]
    : null,
)
</script>

<template>
  <div class="ie">
    <!-- Barre d'outils -->
    <div class="toolbar">
      <button class="tbtn" :disabled="index === 0" title="Précédent" @click="back">‹ Précédent</button>
      <button class="tbtn" :disabled="index >= history.length - 1" title="Suivant" @click="forward">
        Suivant ›
      </button>
      <button class="tbtn icon" title="Actualiser" @click="address = current.url">⟳</button>
      <button class="tbtn icon" title="Démarrage" @click="goHome">⌂</button>
    </div>

    <!-- Barre d'adresse -->
    <div class="addressbar">
      <span class="lbl">Adresse</span>
      <input v-model="address" type="text" @keyup.enter="go" aria-label="Adresse" />
      <button class="go" @click="go">OK</button>
    </div>

    <!-- Contenu -->
    <div class="page">
      <!-- Accueil -->
      <div v-if="current.kind === 'home'" class="start">
        <h1>Bienvenue sur le portfolio de {{ profile.name }}</h1>
        <p class="sub">{{ profile.role }} — {{ profile.tagline }}</p>

        <h2>Mes projets</h2>
        <ul class="links">
          <li v-for="(p, i) in projects" :key="p.name">
            <a href="#" @click.prevent="openProject(i)">{{ p.name }}</a>
            <span class="d">— {{ p.desc.slice(0, 70) }}…</span>
          </li>
        </ul>

        <h2>Liens</h2>
        <ul class="links">
          <li>
            <a href="#" @click.prevent="openExternal('https://alloremplacant.ch')">alloremplacant.ch</a>
            <span class="d">— le projet en production</span>
          </li>
          <li>
            <a href="#" @click.prevent="openExternal(profile.github)">{{ profile.github }}</a>
            <span class="d">— mon GitHub</span>
          </li>
        </ul>
      </div>

      <!-- Page projet -->
      <div v-else-if="activeProject" class="project">
        <h1>{{ activeProject.name }}</h1>
        <p>{{ activeProject.desc }}</p>
        <div class="stack">
          <span v-for="t in activeProject.stack" :key="t" class="tag">{{ t }}</span>
        </div>
        <div class="cta">
          <button @click="openExternal(activeProject.url)">Ouvrir sur GitHub ↗</button>
          <button v-if="activeProject.name.includes('alloremplacant')" @click="openExternal('https://alloremplacant.ch')">
            Visiter alloremplacant.ch ↗
          </button>
        </div>
      </div>
    </div>

    <!-- Barre d'état -->
    <div class="status-bar">
      <div class="status-bar-field grow">Terminé</div>
      <div class="status-bar-field">Internet</div>
    </div>
  </div>
</template>

<style scoped>
.ie {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: Tahoma, sans-serif;
}
.toolbar {
  display: flex;
  gap: 4px;
  padding: 3px 6px;
  background: #ece9d8;
  border-bottom: 1px solid #c5c2b8;
  flex-shrink: 0;
}
.tbtn {
  font-size: 12px;
  border: 1px solid transparent;
  background: transparent;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
  color: #0a1835;
}
.tbtn.icon {
  font-size: 14px;
  padding: 2px 7px;
}
.tbtn:hover:not(:disabled) {
  border-color: #b6c8e8;
  background: #eef4fd;
}
.tbtn:disabled {
  color: #aaa;
  cursor: default;
}
.addressbar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  background: #ece9d8;
  border-bottom: 1px solid #c5c2b8;
  flex-shrink: 0;
}
.addressbar .lbl {
  font-size: 12px;
  color: #555;
}
.addressbar input {
  flex: 1;
  border: 1px solid #7f9db9;
  padding: 2px 6px;
  font-size: 12px;
}
.addressbar .go {
  font-size: 12px;
  padding: 2px 10px;
}

.page {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 16px 20px;
  color: #111;
  background: #fff;
}
.page h1 {
  font-size: 18px;
  margin: 0 0 4px;
  color: #002b6b;
}
.page h2 {
  font-size: 14px;
  margin: 18px 0 6px;
  color: #1c4587;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 3px;
}
.sub {
  font-size: 13px;
  color: #444;
  margin: 0;
}
.links {
  margin: 0;
  padding-left: 18px;
}
.links li {
  font-size: 13px;
  margin: 4px 0;
}
.links a {
  color: #0b57d0;
  text-decoration: underline;
  cursor: pointer;
}
.links .d {
  color: #666;
}
.project p {
  font-size: 13px;
  line-height: 1.6;
  color: #222;
}
.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 12px 0;
}
.tag {
  font-size: 11px;
  background: #eef3fb;
  border: 1px solid #cdddf2;
  color: #1c4587;
  padding: 2px 8px;
  border-radius: 10px;
}
.cta {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
.cta button {
  font-size: 12px;
  padding: 5px 14px;
}
.status-bar {
  display: flex;
  gap: 2px;
  padding: 2px 3px;
  background: #ece9d8;
  flex-shrink: 0;
}
.status-bar-field {
  box-shadow: inset 1px 1px #808080, inset -1px -1px #fff;
  padding: 2px 6px;
  font-size: 12px;
  color: #333;
}
.status-bar-field.grow {
  flex: 1;
}
</style>
