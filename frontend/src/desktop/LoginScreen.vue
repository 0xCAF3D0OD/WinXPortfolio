<script setup lang="ts">
import { ref } from 'vue'
import { profile } from '../portfolio'

const emit = defineEmits<{ done: [] }>()
const loggingIn = ref(false)

// Photo de profil : /xp/login/avatar.jpg si présente, sinon icône neutre.
const avatarSrc = ref('/xp/login/avatar.jpg')
function avatarFallback() {
  avatarSrc.value = '/xp/login/avatar.ico'
}

function login() {
  if (loggingIn.value) return
  loggingIn.value = true
  // Le clic fournit le geste utilisateur requis pour l'audio.
  const logon = new Audio('/xp/sounds/logon.wav')
  logon.play().catch(() => {})
  window.setTimeout(() => emit('done'), 1400)
}
</script>

<template>
  <div class="login" :class="{ out: loggingIn }">
    <header class="bar top"></header>

    <main class="stage">
      <div class="brand">
        <div class="logo">
          <img class="flag" src="/xp/windoors.svg" alt="" />
          <span class="wordmark"><b>windoors</b><i>xp</i></span>
        </div>
        <h1>Pour commencer, cliquez sur votre nom&nbsp;d'utilisateur</h1>
      </div>

      <div class="divider"></div>

      <div class="users">
        <button class="user" :class="{ active: loggingIn }" @click="login">
          <span class="avatar"><img :src="avatarSrc" alt="" @error="avatarFallback" /></span>
          <span class="meta">
            <span class="name">{{ profile.name }}</span>
            <span class="status">{{ loggingIn ? 'Connexion…' : profile.role }}</span>
          </span>
        </button>
      </div>
    </main>

    <footer class="bar bottom">
      <div class="off">
        <span class="off-btn"><img src="/xp/login/power.png" alt="" /></span>
        <p>Arrêter l'ordinateur</p>
      </div>
      <div class="info">
        <p>Après connexion, vous accédez au bureau de {{ profile.name.split(' ')[0] }}.</p>
        <p>Cliquez sur le nom d'utilisateur pour ouvrir la session.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.login {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: flex;
  flex-direction: column;
  font-family: 'Source Sans 3', 'Source Sans Pro', Tahoma, sans-serif;
  user-select: none;
  transition: opacity 0.6s ease;
}
.login.out {
  opacity: 0;
}

.bar {
  width: 100%;
  background: #1231a1;
  position: relative;
  flex-shrink: 0;
}
.bar.top {
  min-height: 96px;
}
.bar.bottom {
  min-height: 96px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stage {
  flex: 1;
  position: relative;
  background: radial-gradient(circle at 6% 9%, #91b0ee 0%, #5a7edc 16%);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
}
/* liserés authentiques (pondérés à gauche, façon XP) */
.stage::before,
.stage::after {
  content: '';
  position: absolute;
  left: 0;
  width: 100%;
  height: 2px;
}
.stage::before {
  top: 0;
  background: linear-gradient(to right, #5076d4, #c3dafd 15% 50%, transparent);
}
.stage::after {
  bottom: 0;
  background: linear-gradient(to right, #06389c, #f99737 15% 50%, transparent);
}

.brand {
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  position: relative;
  top: -8px;
}
.brand .logo {
  display: flex;
  align-items: center;
  gap: 14px;
}
.brand .logo .flag {
  width: 56px;
  height: 50px;
  filter: drop-shadow(1px 2px 3px rgba(0, 0, 0, 0.4));
}
.brand .wordmark {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: Tahoma, sans-serif;
  /* léger flou type ClearType d'origine */
  text-shadow:
    0 0 1px rgba(255, 255, 255, 0.6),
    1px 2px 3px rgba(0, 0, 0, 0.4);
  filter: blur(0.4px);
}
.brand .wordmark b {
  font-size: 38px;
  font-weight: 600;
  color: #fff;
}
.brand .wordmark i {
  font-size: 32px;
  font-weight: 700;
  font-style: italic;
  color: #ff9f17;
}
.brand h1 {
  font-size: 19px;
  font-weight: 500;
  color: #fff;
  margin-top: 26px;
  max-width: 320px;
  text-shadow:
    0 0 1px rgba(255, 255, 255, 0.4),
    1px 1px 2px rgba(0, 0, 0, 0.3);
  filter: blur(0.4px);
}

.divider {
  width: 2px;
  height: 78%;
  background: linear-gradient(180deg, #508fd9 0%, #ffffff 47%, #508fd9 99%);
}

.users {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 40px;
}
.user {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 22px 10px 12px;
  border: none;
  background: transparent;
  border-radius: 4px;
  cursor: pointer;
  text-align: left;
  transition:
    background 0.15s,
    box-shadow 0.15s;
}
.user:hover,
.user.active {
  background: linear-gradient(90deg, rgba(8, 77, 163, 0.95) 0%, rgba(80, 143, 217, 0.6) 100%);
  box-shadow:
    inset 1px 1px 2px rgba(255, 255, 255, 0.35),
    0 1px 4px rgba(0, 0, 0, 0.25);
}
.avatar {
  width: 70px;
  height: 70px;
  border: 2px solid #ffcc00;
  border-radius: 4px;
  background: #cfe0f5;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}
.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.meta {
  display: flex;
  flex-direction: column;
  color: #fff;
}
.name {
  font-size: 22px;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}
.status {
  font-size: 13px;
  opacity: 0.92;
  margin-top: 3px;
}

.off {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: 46px;
}
.off-btn {
  width: 38px;
  height: 38px;
  background: #e55022;
  border: 1px solid #fff;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    inset 4px 2px 8px rgba(255, 255, 255, 0.6),
    inset -2px -3px 5px #aa2300;
}
.off-btn img {
  width: 18px;
  height: 18px;
}
.off p {
  color: #fff;
  font-size: 17px;
}
.info {
  margin-right: 46px;
  color: #fff;
  font-size: 12.5px;
  text-align: center;
  line-height: 1.6;
  opacity: 0.95;
}

@media (max-width: 720px) {
  .stage {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 24px;
  }
  .brand {
    align-items: center;
    text-align: center;
    top: 0;
  }
  .divider {
    display: none;
  }
  .users {
    padding-left: 0;
  }
  .info {
    display: none;
  }
}
</style>
