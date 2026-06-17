<script setup lang="ts">
import { ref, computed, onMounted, inject } from 'vue'
import { profile } from '../../portfolio'
import { articles as fallbackArticles, type Article } from '../../blog'

const openApp = inject<(id: string) => void>('openApp', () => {})

type View = 'login' | 'contacts' | 'blog'
const view = ref<View>('login')
const email = ref(profile.email)

// Articles chargés depuis public/blog/articles.json (éditable/déployable sans rebuild).
// blog.ts sert de repli si le fichier est absent.
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

const avatarSrc = ref('/xp/login/avatar.jpg')
function avatarFallback() {
  avatarSrc.value = '/xp/login/avatar.ico'
}

interface Contact {
  name: string
  status: string
  online: boolean
  href?: string
  app?: string
  blog?: boolean
}
const online = computed<Contact[]>(() => [
  { name: '📓 Blog de Kevin', status: `${articles.value.length} article(s)`, online: true, blog: true },
  { name: 'GitHub — @0xCAF3D0OD', status: 'mes dépôts', online: true, href: profile.github },
  { name: 'LinkedIn', status: 'me contacter', online: true, href: profile.linkedin },
  { name: 'alloremplacant.ch', status: 'projet en prod', online: true, href: 'https://alloremplacant.ch' },
  { name: 'Internet Explorer', status: 'parcourir mes projets', online: true, app: 'iexplorer' },
])
const offline: Contact[] = [
  { name: 'Clippy', status: 'apparaît parfois…', online: false },
  { name: 'BSOD', status: 'tape « bsod » dans le terminal', online: false },
]

function openContact(c: Contact) {
  if (c.blog) view.value = 'blog'
  else if (c.app) openApp(c.app)
  else if (c.href) window.open(c.href, '_blank', 'noopener')
}
</script>

<template>
  <div class="msn">
    <!-- Connexion -->
    <template v-if="view === 'login'">
      <div class="head"><img class="logo" src="/xp/msn/msnlogo.png" alt="MSN Messenger" /></div>
      <div class="signin">
        <div class="buddy"><img src="/xp/msn/msnexplorer.png" alt="" /></div>
        <label>Adresse e-mail :</label>
        <input v-model="email" type="email" />
        <label>Mot de passe :</label>
        <input type="password" value="********" />
        <p class="status">État : <b>En ligne</b></p>
        <button class="connect" @click="view = 'contacts'">Se connecter</button>
      </div>
    </template>

    <!-- Liste de contacts -->
    <template v-else-if="view === 'contacts'">
      <div class="me">
        <span class="ppic"><img :src="avatarSrc" alt="" @error="avatarFallback" /></span>
        <div class="meinfo">
          <p class="name">{{ profile.name }} <span class="on">(En ligne)</span></p>
          <p class="psm">« {{ profile.tagline }} »</p>
        </div>
      </div>
      <div class="list">
        <p class="group">En ligne ({{ online.length }})</p>
        <button v-for="c in online" :key="c.name" class="contact" @click="openContact(c)">
          <span class="dot on"></span><span class="cname">{{ c.name }}</span
          ><span class="cstatus">— {{ c.status }}</span>
        </button>
        <p class="group">Hors ligne ({{ offline.length }})</p>
        <button v-for="c in offline" :key="c.name" class="contact off" @click="openContact(c)">
          <span class="dot"></span><span class="cname">{{ c.name }}</span
          ><span class="cstatus">— {{ c.status }}</span>
        </button>
      </div>
      <div class="msnfoot"><img src="/xp/msn/msnlogo.png" alt="" /></div>
    </template>

    <!-- Blog (conversation) -->
    <template v-else>
      <div class="convbar">
        <button class="back" @click="view = 'contacts'">‹ Contacts</button>
        <span class="convtitle">Blog de {{ profile.name }}</span>
      </div>
      <div class="conv">
        <article v-for="(a, idx) in articles" :key="idx" class="post">
          <div class="post-head">
            <span class="ppic small"><img :src="avatarSrc" alt="" @error="avatarFallback" /></span>
            <div>
              <p class="post-title">{{ a.title }}</p>
              <p class="post-date">{{ profile.name }} · {{ a.date }}</p>
            </div>
          </div>
          <div class="bubble">
            <p v-for="(p, k) in a.body" :key="k">{{ p }}</p>
            <div v-if="a.tags?.length" class="tags">
              <span v-for="t in a.tags" :key="t">#{{ t }}</span>
            </div>
          </div>
        </article>
      </div>
      <div class="msnfoot"><img src="/xp/msn/msnlogo.png" alt="" /></div>
    </template>
  </div>
</template>

<style scoped>
.msn {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Tahoma, sans-serif;
}
.head {
  background: linear-gradient(to bottom, #eaf3ff, #cfe4fb);
  padding: 10px 12px;
  border-bottom: 1px solid #9cc0e9;
}
.head .logo {
  height: 34px;
}
.signin {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 16px;
  background: linear-gradient(to bottom, #ffffff, #eef5fe);
}
.buddy {
  width: 84px;
  height: 84px;
  border: 1px solid #9cc0e9;
  border-radius: 6px;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}
.buddy img {
  width: 64px;
  height: 64px;
}
.signin label {
  font-size: 12px;
  color: #234;
  margin-top: 4px;
}
.signin input {
  width: 200px;
  border: 1px solid #7f9db9;
  padding: 3px 5px;
  font-size: 12px;
}
.status {
  font-size: 12px;
  color: #234;
  margin: 8px 0 4px;
}
.connect {
  margin-top: 6px;
  padding: 4px 16px;
  font-size: 12px;
}

.me {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: linear-gradient(to bottom, #eaf3ff, #cfe4fb);
  border-bottom: 1px solid #9cc0e9;
}
.ppic {
  width: 48px;
  height: 48px;
  border: 1px solid #5a85b8;
  border-radius: 4px;
  overflow: hidden;
  flex-shrink: 0;
}
.ppic.small {
  width: 34px;
  height: 34px;
}
.ppic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.name {
  margin: 0;
  font-size: 13px;
  font-weight: bold;
  color: #14315a;
}
.name .on {
  color: #2a8a2a;
  font-weight: normal;
  font-size: 11px;
}
.psm {
  margin: 2px 0 0;
  font-size: 11px;
  font-style: italic;
  color: #5a7088;
}
.list {
  flex: 1;
  overflow: auto;
  padding: 6px 4px;
}
.group {
  font-size: 11px;
  font-weight: bold;
  color: #1c4587;
  margin: 6px 6px 2px;
}
.contact {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  border: none;
  background: transparent;
  padding: 3px 8px;
  font-size: 12px;
  color: #111;
  cursor: pointer;
  text-align: left;
}
.contact:hover {
  background: #e8f0fe;
}
.contact.off {
  opacity: 0.55;
}
.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #b0b0b0;
  flex-shrink: 0;
}
.dot.on {
  background: #34c759;
  box-shadow: 0 0 0 1px #1a8a3a;
}
.cstatus {
  color: #777;
}

/* Blog */
.convbar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: linear-gradient(to bottom, #eaf3ff, #cfe4fb);
  border-bottom: 1px solid #9cc0e9;
}
.back {
  font-size: 11px;
  padding: 2px 8px;
}
.convtitle {
  font-size: 12px;
  font-weight: bold;
  color: #14315a;
}
.conv {
  flex: 1;
  overflow: auto;
  padding: 10px;
  background: linear-gradient(to bottom, #ffffff, #f3f8ff);
}
.post {
  margin-bottom: 16px;
}
.post-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.post-title {
  margin: 0;
  font-size: 13px;
  font-weight: bold;
  color: #1c4587;
}
.post-date {
  margin: 0;
  font-size: 11px;
  color: #888;
}
.bubble {
  border: 1px solid #b9d3ef;
  background: #eef5ff;
  border-radius: 10px;
  padding: 8px 12px;
  margin-left: 42px;
}
.bubble p {
  margin: 0 0 6px;
  font-size: 12px;
  line-height: 1.5;
  color: #222;
}
.bubble p:last-child {
  margin-bottom: 0;
}
.tags {
  display: flex;
  gap: 6px;
  margin-top: 6px;
}
.tags span {
  font-size: 10px;
  color: #2a6fd6;
}
.msnfoot {
  border-top: 1px solid #cfe4fb;
  padding: 6px;
  text-align: center;
}
.msnfoot img {
  height: 20px;
  opacity: 0.8;
}
</style>
