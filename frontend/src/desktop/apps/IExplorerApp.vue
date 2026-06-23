<script setup lang="ts">
import { ref, computed, nextTick, onMounted, inject } from 'vue'
import { projects, profile, about, experience, education, skills } from '../../portfolio'

const openApp = inject<(id: string) => void>('openApp', () => {})

// Pages WikiDK personnalisées (éditables dans public/wiki/pages.json, sans rebuild).
interface WikiSection {
  heading: string
  body: string[]
}
interface WikiPage {
  slug: string
  title: string
  body?: string[]
  sections?: WikiSection[]
}
const customPages = ref<WikiPage[]>([])
onMounted(async () => {
  try {
    const res = await fetch('/wiki/pages.json', { cache: 'no-cache' })
    if (res.ok) {
      const data = await res.json()
      if (Array.isArray(data)) customPages.value = data
    }
  } catch {
    /* pas de pages custom */
  }
})

interface Page {
  url: string
  title: string
  kind: 'wiki' | 'project' | 'custom'
  projectIndex?: number
  pageSlug?: string
}

const wikiUrl = 'http://wikidk.org/wiki/Kevin_Di_Nocera'
const home: Page = { url: wikiUrl, title: 'Kevin Di Nocera — WikiDK', kind: 'wiki' }
// Dépôt utilisé pour l'onglet « Discussion » (issues GitHub).
const issuesRepo = 'https://github.com/0xCAF3D0OD/Educhat'

const favOpen = ref(false)
const favorites = [
  { label: 'GitHub — @0xCAF3D0OD', url: profile.github },
  { label: 'LinkedIn', url: 'https://' + profile.linkedin.replace(/^https?:\/\//, '') },
  { label: 'alloremplacant.ch', url: 'https://alloremplacant.ch' },
  { label: 'Educhat (dépôt)', url: 'https://github.com/0xCAF3D0OD/Educhat' },
]
const menuItems = ['Fichier', 'Edition', 'Affichage', 'Favoris', 'Outils', '?']
const tabsRight = ['Lire', 'Modifier', 'Historique']
const footerBlocks = [0, 1, 2, 3]

const history = ref<Page[]>([home])
const index = ref(0)
const current = computed(() => history.value[index.value]!)
const address = ref(current.value.url)
const pageEl = ref<HTMLElement | null>(null)

const avatarSrc = ref('/xp/login/avatar.jpg')
function avatarFallback() {
  avatarSrc.value = '/xp/login/avatar.ico'
}

function navigate(page: Page) {
  history.value = history.value.slice(0, index.value + 1)
  history.value.push(page)
  index.value = history.value.length - 1
  address.value = page.url
  nextTick(() => pageEl.value?.scrollTo(0, 0))
}
function back() {
  if (index.value > 0) {
    index.value--
    address.value = current.value.url
  }
}
function forward() {
  if (index.value < history.value.length - 1) {
    index.value++
    address.value = current.value.url
  }
}
function goHome() {
  navigate(home)
}
function openProject(i: number) {
  const p = projects[i]!
  navigate({ url: `${wikiUrl}/projets/${p.name}`, title: p.name, kind: 'project', projectIndex: i })
}
function openCustom(p: WikiPage) {
  navigate({ url: `${wikiUrl}/${p.slug}`, title: p.title, kind: 'custom', pageSlug: p.slug })
}
function openExternal(url: string) {
  window.open(url, '_blank', 'noopener')
}
// Onglet « Discussion » -> issues GitHub du dépôt concerné.
function openDiscussion() {
  const base = activeProject.value ? activeProject.value.url : issuesRepo
  openExternal(base.replace(/\/$/, '') + '/issues')
}
function mail() {
  openApp('guestbook')
}
function print() {
  window.print()
}
function go() {
  let url = address.value.trim()
  if (!url) return
  if (!/^https?:\/\//.test(url) && url.includes('.')) url = 'https://' + url
  if (/^https?:\/\//.test(url)) openExternal(url)
}
function scrollTo(id: string) {
  pageEl.value?.querySelector('#' + id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
function toggleFavorites(event: MouseEvent) {
  event.stopPropagation()
  favOpen.value = !favOpen.value
}

const sideNavigationLinks = [
  { label: 'Accueil', onClick: goHome },
  { label: 'Biographie', onClick: () => scrollTo('bio') },
  { label: 'Parcours professionnel', onClick: () => scrollTo('parcours') },
  { label: 'Formation', onClick: () => scrollTo('formation') },
  { label: 'Compétences', onClick: () => scrollTo('competences') },
  { label: 'Projets', onClick: () => scrollTo('projets') },
]
const sideExternalLinks = [
  { label: 'GitHub ↗', url: profile.github },
  { label: 'alloremplacant.ch ↗', url: 'https://alloremplacant.ch' },
]

interface ToolbarButton {
  key: string
  title: string
  icon: string
  iconClass?: string
  label?: string
  arrow?: boolean
  disabled?: boolean
  favorite?: boolean
  onClick?: (event: MouseEvent) => void
}
const toolbarSections = computed<ToolbarButton[][]>(() => [
  [
    {
      key: 'back',
      title: 'Précédent',
      icon: '/xp/ie/back.png',
      label: 'Précédent',
      arrow: true,
      disabled: index.value === 0,
      onClick: back,
    },
    {
      key: 'forward',
      title: 'Suivant',
      icon: '/xp/ie/forward.png',
      arrow: true,
      disabled: index.value >= history.value.length - 1,
      onClick: forward,
    },
    { key: 'stop', title: 'Arrêter', icon: '/xp/ie/stop.png', disabled: true },
    { key: 'refresh', title: 'Actualiser', icon: '/xp/ie/refresh.png', onClick: goHome },
    { key: 'home', title: 'Démarrage', icon: '/xp/ie/home.png', onClick: goHome },
  ],
  [
    {
      key: 'search',
      title: 'Rechercher',
      icon: '/xp/ie/search.png',
      iconClass: 'sm',
      label: 'Rechercher',
      onClick: () => scrollTo('competences'),
    },
    {
      key: 'favorites',
      title: 'Favoris',
      icon: '/xp/ie/favorites.png',
      iconClass: 'sm',
      label: 'Favoris',
      favorite: true,
      onClick: toggleFavorites,
    },
    { key: 'history', title: 'Historique', icon: '/xp/ie/history.png', iconClass: 'sm' },
  ],
  [
    {
      key: 'mail',
      title: 'Courrier — me contacter',
      icon: '/xp/ie/mail.png',
      arrow: true,
      onClick: mail,
    },
    {
      key: 'print',
      title: 'Imprimer',
      icon: '/xp/ie/printer.png',
      iconClass: 'sm12',
      onClick: print,
    },
    { key: 'edit', title: 'Modifier', icon: '/xp/ie/edit.png', disabled: true },
    {
      key: 'msn',
      title: 'Messenger',
      icon: '/xp/ie/msn.png',
      iconClass: 'sm12',
      onClick: () => openApp('msn'),
    },
  ],
])

const activeProject = computed(() =>
  current.value.kind === 'project' && current.value.projectIndex !== undefined
    ? projects[current.value.projectIndex]
    : null,
)
const activeCustom = computed(() =>
  current.value.kind === 'custom'
    ? customPages.value.find((p) => p.slug === current.value.pageSlug) || null
    : null,
)
</script>

<template>
  <div class="ie">
    <!-- Barre d'outils -->
    <!-- Barre de menus -->
    <div class="ie__menu">
      <span v-for="item in menuItems" :key="item">{{ item }}</span>
      <img class="ie__menu-logo" src="/xp/tray/xplogo.png" alt="" />
    </div>

    <!-- Barre de fonctions -->
    <div class="ie__bar">
      <template v-for="(section, sectionIndex) in toolbarSections" :key="sectionIndex">
        <span v-if="sectionIndex > 0" class="ie__sep"></span>
        <div
          v-for="button in section"
          :key="button.key"
          class="ie__btn"
          :class="{ 'ie__btn--disable': button.disabled, fav: button.favorite }"
          :title="button.title"
          @click="(event) => button.onClick?.(event)"
        >
          <img :class="button.iconClass" :src="button.icon" alt="" /><span
            v-if="button.label"
            class="t"
            >{{ button.label }}</span
          ><i v-if="button.arrow" class="arr"></i>
          <div v-if="button.favorite && favOpen" class="fav-menu" @click.stop>
            <p class="fav-title">Favoris</p>
            <a v-for="f in favorites" :key="f.url" @click="openExternal(f.url)">{{ f.label }}</a>
          </div>
        </div>
      </template>
    </div>

    <!-- Barre d'adresse -->
    <div class="ie__address">
      <span class="ie__address-title">Adresse</span>
      <div class="ie__address-box">
        <img src="/xp/ie/ie-paper.png" alt="" />
        <input v-model="address" type="text" @keyup.enter="go" aria-label="Adresse" />
      </div>
      <button class="ie__go" @click="go"><img src="/xp/ie/go.png" alt="" />Aller</button>
    </div>

    <!-- Contenu : WikiDK -->
    <div class="page" ref="pageEl">
      <div class="wiki">
        <!-- Barre latérale -->
        <aside class="wiki-side">
          <div class="logo">
            <img src="/xp/icons/wiki.svg" alt="Wiki" class="wiki-icon" />
            <div class="wm">
              <b>Wiki<span>DK</span></b
              ><small>L'encyclopédie de Kevin</small>
            </div>
          </div>
          <p class="navtitle">navigation</p>
          <ul>
            <li v-for="link in sideNavigationLinks" :key="link.label">
              <a @click="link.onClick">{{ link.label }}</a>
            </li>
          </ul>
          <template v-if="customPages.length">
            <p class="navtitle">pages</p>
            <ul>
              <li v-for="p in customPages" :key="p.slug">
                <a @click="openCustom(p)">{{ p.title }}</a>
              </li>
            </ul>
          </template>
          <p class="navtitle">liens externes</p>
          <ul>
            <li v-for="link in sideExternalLinks" :key="link.url">
              <a @click="openExternal(link.url)">{{ link.label }}</a>
            </li>
          </ul>
        </aside>

        <!-- Article -->
        <main class="wiki-main">
          <div class="tabs">
            <span class="tab active">Article</span
            ><span class="tab clickable" title="Issues GitHub" @click="openDiscussion"
              >Discussion ↗</span
            >
            <span class="tabs-right"
              ><span v-for="tab in tabsRight" :key="tab" class="tab">{{ tab }}</span></span
            >
          </div>

          <!-- Page WikiDK personnalisée (depuis le JSON) -->
          <template v-if="activeCustom">
            <h1>{{ activeCustom.title }}</h1>
            <p class="sub">Un article de WikiDK, l'encyclopédie libre.</p>
            <p v-for="(p, i) in activeCustom.body || []" :key="i">{{ p }}</p>
            <template v-for="(s, si) in activeCustom.sections || []" :key="si">
              <h2>{{ s.heading }}</h2>
              <p v-for="(p, pi) in s.body" :key="pi">{{ p }}</p>
            </template>
            <p><a @click="goHome">← Retour à l'article principal</a></p>
          </template>

          <!-- Page projet -->
          <template v-else-if="activeProject">
            <h1>{{ activeProject.name }}</h1>
            <p class="sub">Un article de WikiDK, l'encyclopédie libre.</p>
            <p>{{ activeProject.desc }}</p>
            <p><b>Technologies :</b> {{ activeProject.stack.join(', ') }}.</p>
            <p>
              <a class="ext" @click="openExternal(activeProject.url)">Voir le dépôt sur GitHub ↗</a>
            </p>
            <p><a @click="goHome">← Retour à l'article principal</a></p>
          </template>

          <!-- Article principal -->
          <template v-else>
            <h1>{{ profile.name }}</h1>
            <p class="sub">Un article de WikiDK, l'encyclopédie libre.</p>

            <div class="infobox">
              <div class="ib-title">{{ profile.name }}</div>
              <div class="ib-photo"><img :src="avatarSrc" alt="" @error="avatarFallback" /></div>
              <table>
                <tbody>
                  <tr>
                    <th>Poste</th>
                    <td>{{ profile.role }}</td>
                  </tr>
                  <tr>
                    <th>Localisation</th>
                    <td>{{ profile.location }}</td>
                  </tr>
                  <tr>
                    <th>Courriel</th>
                    <td>
                      <a class="ext" @click="openExternal('mailto:' + profile.email)">{{
                        profile.email
                      }}</a>
                    </td>
                  </tr>
                  <tr>
                    <th>GitHub</th>
                    <td><a class="ext" @click="openExternal(profile.github)">@0xCAF3D0OD</a></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              <b>{{ profile.name }}</b> est {{ profile.role.toLowerCase() }} basé en
              {{ (profile.location.split('·')[0] ?? profile.location).trim() }}.
              {{ about[0] }}
            </p>

            <h2 id="bio">Biographie</h2>
            <p v-for="(p, i) in about" :key="i">{{ p }}</p>

            <h2 id="parcours">Parcours professionnel</h2>
            <ul class="timeline">
              <li v-for="(e, i) in experience" :key="i">
                <b>{{ e.title }}</b> — {{ e.company }} <span class="muted">({{ e.period }})</span
                ><br />
                <span v-for="(l, k) in e.desc.split('\n')" :key="k">{{ l }}<br /></span>
              </li>
            </ul>

            <h2 id="formation">Formation</h2>
            <ul class="timeline">
              <li v-for="(ed, i) in education" :key="i">
                <b>{{ ed.school }}</b> <span class="muted">({{ ed.period }})</span><br />{{
                  ed.detail
                }}
              </li>
            </ul>

            <h2 id="competences">Compétences</h2>
            <table class="skills">
              <tbody>
                <tr v-for="s in skills" :key="s.group">
                  <th>{{ s.group }}</th>
                  <td>{{ s.items.join(', ') }}</td>
                </tr>
              </tbody>
            </table>

            <h2 id="projets">Projets</h2>
            <ul class="projlist">
              <li v-for="(p, i) in projects" :key="p.name">
                <a @click="openProject(i)">{{ p.name }}</a> — {{ p.desc.slice(0, 90) }}…
              </li>
            </ul>

            <p class="footer-note">
              Cet article est une recréation ludique façon encyclopédie. Pour me contacter, ouvre «
              Me contacter » sur le bureau.
            </p>
          </template>
        </main>
      </div>
    </div>

    <!-- Footer / barre d'état façon winXP -->
    <div class="ie__footer">
      <div class="ie__footer-status">
        <img src="/xp/ie/ie-paper.png" alt="" />
        <span>Terminé</span>
      </div>
      <div v-for="block in footerBlocks" :key="block" class="ie__footer-block"></div>
      <div class="ie__footer-right" style="position: relative">
        <img src="/xp/ie/earth.png" alt="" />
        <span>Internet</span>
        <div class="dots"></div>
      </div>
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
/* Chrome Internet Explorer repris de ShizukuIchi/winXP (MIT). */
.ie__menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 2px 8px;
  font-size: 12px;
  color: #1a1a1a;
  background: linear-gradient(to bottom, #fdfdfd, #ecebe4);
  border-bottom: 1px solid #c5c2b8;
  flex-shrink: 0;
}
.ie__menu span {
  cursor: default;
}
.ie__menu-logo {
  margin-left: auto;
  width: 22px;
  height: 22px;
}
.ie__bar {
  height: 38px;
  display: flex;
  align-items: center;
  font-size: 11px;
  padding: 1px 4px 0;
  background: linear-gradient(to bottom, #f8f8f4, #d6d3c6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.15);
  flex-shrink: 0;
}
.ie__btn {
  display: flex;
  height: 100%;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 3px;
  cursor: pointer;
  color: #1a1a1a;
  padding: 0 2px;
}
.ie__btn:hover {
  border-color: rgba(0, 0, 0, 0.18);
  box-shadow: inset 0 -1px 1px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.4);
}
.ie__btn:active {
  border-color: #b9b9b9;
  background: #dedede;
}
.ie__btn:active > * {
  transform: translate(1px, 1px);
}
.ie__btn--disable {
  filter: grayscale(1);
  opacity: 0.55;
  pointer-events: none;
}
.ie__btn img {
  width: 30px;
  height: 30px;
}
.ie__btn img.sm {
  width: 22px;
  height: 22px;
  margin: 0 3px 0 1px;
}
.ie__btn .t {
  margin-right: 4px;
}
.ie__btn .arr {
  width: 0;
  height: 0;
  border: 3px solid transparent;
  border-top-color: #000;
  border-bottom: 0;
  margin: 0 4px;
}
.ie__sep {
  width: 1px;
  height: 80%;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 3px;
}
.ie__address {
  height: 24px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 4px 2px;
  font-size: 11px;
  background: #ece9d8;
  border-bottom: 1px solid #c5c2b8;
  box-shadow: inset 0 -2px 3px -1px rgba(45, 45, 45, 0.4);
  flex-shrink: 0;
}
.ie__address-title {
  color: rgba(0, 0, 0, 0.5);
  padding: 0 4px;
}
.ie__address-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
  background: #fff;
  border: 1px solid #7f9db9;
  padding: 0 3px;
}
.ie__address-box img {
  width: 14px;
  height: 14px;
}
.ie__address-box input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 12px;
}
.ie__go {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 3px;
  padding: 1px 6px 1px 3px;
  cursor: pointer;
}
.ie__go:hover {
  border-color: rgba(0, 0, 0, 0.18);
  background: rgba(255, 255, 255, 0.5);
}
.ie__go img {
  width: 18px;
  height: 18px;
}

.page {
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: #fff;
}

/* --- Wikipédia (WikiDK) --- */
.wiki {
  display: flex;
  align-items: flex-start;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  font-size: 13px;
  color: #202122;
}
.wiki-side {
  width: 140px;
  flex-shrink: 0;
  padding: 10px 8px;
  background: #f6f6f6;
  border-right: 1px solid #e8e8e8;
}
.logo {
  text-align: center;
  margin-bottom: 12px;
}
.globe {
  width: 64px;
  height: 64px;
}
.wm b {
  display: block;
  font-family: Georgia, serif;
  font-size: 17px;
  font-weight: normal;
  color: #202122;
}
.wm b span {
  color: #b0392b;
}
.wm small {
  font-size: 9px;
  color: #54595d;
}
.navtitle {
  font-size: 11px;
  color: #54595d;
  margin: 10px 0 2px;
  border-bottom: 1px solid #e8e8e8;
}
.wiki-side ul {
  list-style: none;
  margin: 0 0 6px;
  padding: 0;
}
.wiki-side li {
  margin: 2px 0;
}
.wiki-side a {
  color: #0645ad;
  cursor: pointer;
  font-size: 12px;
}
.wiki-side a:hover {
  text-decoration: underline;
}

.wiki-main {
  flex: 1;
  min-width: 0;
  padding: 12px 18px 24px;
}
.tabs {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  border-bottom: 1px solid #a2a9b1;
  margin-bottom: 10px;
  font-size: 12px;
}
.tab {
  padding: 3px 8px;
  color: #0645ad;
  border: 1px solid #a2a9b1;
  border-bottom: none;
  background: #f8f9fa;
  border-radius: 3px 3px 0 0;
}
.tab.active {
  background: #fff;
  color: #202122;
  font-weight: bold;
}
.tabs-right {
  margin-left: auto;
  display: flex;
  gap: 2px;
}
h1 {
  font-family: Georgia, 'Linux Libertine', serif;
  font-size: 26px;
  font-weight: normal;
  margin: 0;
  padding-bottom: 4px;
  border-bottom: 1px solid #a2a9b1;
}
.sub {
  font-size: 11px;
  color: #54595d;
  margin: 4px 0 12px;
}
h2 {
  font-family: Georgia, 'Linux Libertine', serif;
  font-size: 19px;
  font-weight: normal;
  margin: 18px 0 6px;
  padding-bottom: 3px;
  border-bottom: 1px solid #a2a9b1;
}
.wiki-main p {
  line-height: 1.6;
  margin: 0 0 10px;
}
.wiki-main a {
  color: #0645ad;
  cursor: pointer;
}
.wiki-main a:hover {
  text-decoration: underline;
}
.muted {
  color: #72777d;
}
.timeline {
  margin: 0 0 10px;
  padding-left: 18px;
  line-height: 1.6;
}
.timeline li {
  margin-bottom: 8px;
}
table.skills,
.infobox table {
  border-collapse: collapse;
}
table.skills {
  width: 100%;
  font-size: 13px;
}
table.skills th {
  text-align: left;
  width: 130px;
  vertical-align: top;
  color: #54595d;
  padding: 3px 8px 3px 0;
  font-weight: bold;
}
table.skills td {
  padding: 3px 0;
}
.projlist {
  padding-left: 18px;
  line-height: 1.7;
}

/* Infobox flottante (droite) */

.infobox {
  float: right;
  width: 210px;
  margin: 0 0 12px 16px;
  border: 1px solid #a2a9b1;
  background: #f8f9fa;
  padding: 8px;
  font-size: 12px;
}
.infobox td {
  max-width: 0; /* Astuce nécessaire pour que le text-overflow fonctionne en tableau */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ib-title {
  text-align: center;
  font-weight: bold;
  background: #ccd;
  margin: -8px -8px 8px;
  padding: 5px;
  background: #cedff2;
}
.ib-photo {
  text-align: center;
  margin-bottom: 8px;
}
.ib-photo img {
  width: 110px;
  height: 110px;
  object-fit: cover;
  border: 1px solid #a2a9b1;
}
.infobox table {
  width: 100%;
}
.infobox th {
  text-align: left;
  vertical-align: top;
  color: #54595d;
  padding: 3px 6px 3px 0;
  width: 78px;
}
.infobox td {
  padding: 3px 0;
}
.ext::after {
  content: '';
}
.footer-note {
  margin-top: 18px;
  padding-top: 8px;
  border-top: 1px solid #e8e8e8;
  font-size: 11px;
  color: #72777d;
  font-style: italic;
}
/* Footer / barre d'état façon winXP */
.ie__footer {
  height: 20px;
  display: flex;
  align-items: center;
  padding-top: 2px;
  background: #ece9d8;
  box-shadow: inset 0 1px 3px rgba(50, 50, 50, 0.6);
  flex-shrink: 0;
  font-size: 11px;
  color: #333;
}
.ie__footer-status {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  gap: 3px;
  padding-left: 3px;
}
.ie__footer-status img {
  width: 14px;
  height: 14px;
}
.ie__footer-block {
  height: 85%;
  width: 22px;
  border-left: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: inset 1px 0 rgba(255, 255, 255, 0.7);
}
.ie__footer-right {
  width: 150px;
  height: 80%;
  display: flex;
  align-items: center;
  gap: 3px;
  padding-left: 6px;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  box-shadow: inset 1px 0 rgba(255, 255, 255, 0.7);
}
.ie__footer-right img {
  width: 14px;
  height: 14px;
}

.ie__footer-right .dots {
  position: absolute;
  right: 11px;
  bottom: -1px;
  width: 2px;
  height: 2px;
  box-shadow:
    2px 0px rgba(0, 0, 0, 0.25),
    5.5px 0px rgba(0, 0, 0, 0.25),
    9px 0px rgba(0, 0, 0, 0.25),
    5.5px -3.5px rgba(0, 0, 0, 0.25),
    9px -3.5px rgba(0, 0, 0, 0.25),
    9px -7px rgba(0, 0, 0, 0.25),
    3px 1px rgba(255, 255, 255, 1),
    6.5px 1px rgba(255, 255, 255, 1),
    10px 1px rgba(255, 255, 255, 1),
    10px -2.5px rgba(255, 255, 255, 1),
    10px -6px rgba(255, 255, 255, 1);
}

/* Onglet Discussion cliquable */
.tab.clickable {
  cursor: pointer;
}
.tab.clickable:hover {
  text-decoration: underline;
}

/* Menu Favoris */
.ie__btn.fav {
  position: relative;
}
.fav-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 20;
  min-width: 180px;
  background: #fff;
  border: 1px solid #7f7f7f;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  padding: 3px 0;
  cursor: default;
}
.fav-title {
  margin: 0;
  padding: 3px 10px;
  font-weight: bold;
  color: #555;
  border-bottom: 1px solid #e0e0e0;
}
.fav-menu a {
  display: block;
  padding: 4px 12px;
  font-size: 12px;
  color: #0645ad;
  cursor: pointer;
  white-space: nowrap;
}
.fav-menu a:hover {
  background: #316ac5;
  color: #fff;
}
.ie__btn img.sm12 {
  width: 22px;
  height: 22px;
  margin: 0 2px;
}
</style>
