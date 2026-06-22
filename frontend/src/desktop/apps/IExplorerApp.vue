<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { projects, profile, about, experience, education, skills } from '../../portfolio'

interface Page {
  url: string
  title: string
  kind: 'wiki' | 'project'
  projectIndex?: number
}

const wikiUrl = 'http://wikidk.org/wiki/Kevin_Di_Nocera'
const home: Page = { url: wikiUrl, title: 'Kevin Di Nocera — WikiDK', kind: 'wiki' }

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
function openExternal(url: string) {
  window.open(url, '_blank', 'noopener')
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

const activeProject = computed(() =>
  current.value.kind === 'project' && current.value.projectIndex !== undefined
    ? projects[current.value.projectIndex]
    : null,
)
const firstName = profile.name.split(' ')[0]
</script>

<template>
  <div class="ie">
    <!-- Barre d'outils -->
    <!-- Barre de menus -->
    <div class="ie__menu">
      <span>Fichier</span><span>Edition</span><span>Affichage</span><span>Favoris</span
      ><span>Outils</span><span>?</span>
      <img class="ie__menu-logo" src="/xp/ie/windows.png" alt="" />
    </div>

    <!-- Barre de fonctions -->
    <div class="ie__bar">
      <div
        class="ie__btn"
        :class="{ 'ie__btn--disable': index === 0 }"
        title="Précédent"
        @click="back"
      >
        <img src="/xp/ie/back.png" alt="" /><span class="t">Précédent</span><i class="arr"></i>
      </div>
      <div
        class="ie__btn"
        :class="{ 'ie__btn--disable': index >= history.length - 1 }"
        title="Suivant"
        @click="forward"
      >
        <img src="/xp/ie/forward.png" alt="" /><i class="arr"></i>
      </div>
      <div class="ie__btn ie__btn--disable" title="Arrêter"><img src="/xp/ie/stop.png" alt="" /></div>
      <div class="ie__btn" title="Actualiser" @click="goHome"><img src="/xp/ie/refresh.png" alt="" /></div>
      <div class="ie__btn" title="Démarrage" @click="goHome"><img src="/xp/ie/home.png" alt="" /></div>
      <span class="ie__sep"></span>
      <div class="ie__btn" title="Rechercher">
        <img class="sm" src="/xp/ie/search.png" alt="" /><span class="t">Rechercher</span>
      </div>
      <div class="ie__btn" title="Favoris">
        <img class="sm" src="/xp/ie/favorites.png" alt="" /><span class="t">Favoris</span>
      </div>
      <div class="ie__btn" title="Historique"><img class="sm" src="/xp/ie/history.png" alt="" /></div>
      <span class="ie__sep"></span>
      <div class="ie__btn" title="Courrier"><img src="/xp/ie/mail.png" alt="" /><i class="arr"></i></div>
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
            <li><a @click="goHome">Accueil</a></li>
            <li><a @click="scrollTo('bio')">Biographie</a></li>
            <li><a @click="scrollTo('parcours')">Parcours professionnel</a></li>
            <li><a @click="scrollTo('formation')">Formation</a></li>
            <li><a @click="scrollTo('competences')">Compétences</a></li>
            <li><a @click="scrollTo('projets')">Projets</a></li>
          </ul>
          <p class="navtitle">liens externes</p>
          <ul>
            <li><a @click="openExternal(profile.github)">GitHub ↗</a></li>
            <li><a @click="openExternal('https://alloremplacant.ch')">alloremplacant.ch ↗</a></li>
          </ul>
        </aside>

        <!-- Article -->
        <main class="wiki-main">
          <div class="tabs">
            <span class="tab active">Article</span><span class="tab">Discussion</span>
            <span class="tabs-right"
              ><span class="tab">Lire</span><span class="tab">Modifier</span
              ><span class="tab">Historique</span></span
            >
          </div>

          <!-- Page projet -->
          <template v-if="activeProject">
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
              <tr v-for="s in skills" :key="s.group">
                <th>{{ s.group }}</th>
                <td>{{ s.items.join(', ') }}</td>
              </tr>
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
.status-bar {
  display: flex;
  gap: 2px;
  padding: 2px 3px;
  background: #ece9d8;
  flex-shrink: 0;
}
.status-bar-field {
  box-shadow:
    inset 1px 1px #808080,
    inset -1px -1px #fff;
  padding: 2px 6px;
  font-size: 12px;
  color: #333;
}
.status-bar-field.grow {
  flex: 1;
}
</style>
