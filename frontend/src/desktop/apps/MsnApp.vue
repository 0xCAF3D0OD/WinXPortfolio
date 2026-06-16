<script setup lang="ts">
import { ref, inject } from 'vue'
import { profile } from '../../portfolio'

const openApp = inject<(id: string) => void>('openApp', () => {})

const signedIn = ref(false)
const email = ref(profile.email)

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
}
const online: Contact[] = [
  { name: 'GitHub — @0xCAF3D0OD', status: 'mes dépôts', online: true, href: profile.github },
  { name: 'LinkedIn', status: 'me contacter', online: true, href: profile.linkedin },
  { name: 'alloremplacant.ch', status: 'projet en prod', online: true, href: 'https://alloremplacant.ch' },
  { name: 'Internet Explorer', status: 'parcourir mes projets', online: true, app: 'iexplorer' },
]
const offline: Contact[] = [
  { name: 'Clippy', status: 'apparaît parfois…', online: false },
  { name: 'BSOD', status: 'tape « bsod » dans le terminal', online: false },
]

function openContact(c: Contact) {
  if (c.app) openApp(c.app)
  else if (c.href) window.open(c.href, '_blank', 'noopener')
}
</script>

<template>
  <div class="msn">
    <!-- Connexion -->
    <template v-if="!signedIn">
      <div class="head">
        <img class="logo" src="/xp/msn/msnlogo.png" alt="MSN Messenger" />
      </div>
      <div class="signin">
        <div class="buddy"><img src="/xp/msn/msnexplorer.png" alt="" /></div>
        <label>Adresse e-mail :</label>
        <input v-model="email" type="email" />
        <label>Mot de passe :</label>
        <input type="password" value="********" />
        <p class="status">État : <b>En ligne</b></p>
        <button class="connect" @click="signedIn = true">Se connecter</button>
      </div>
    </template>

    <!-- Liste de contacts -->
    <template v-else>
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
          <span class="dot on"></span>
          <span class="cname">{{ c.name }}</span>
          <span class="cstatus">— {{ c.status }}</span>
        </button>
        <p class="group">Hors ligne ({{ offline.length }})</p>
        <button v-for="c in offline" :key="c.name" class="contact off" @click="openContact(c)">
          <span class="dot"></span>
          <span class="cname">{{ c.name }}</span>
          <span class="cstatus">— {{ c.status }}</span>
        </button>
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
  align-self: center;
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
