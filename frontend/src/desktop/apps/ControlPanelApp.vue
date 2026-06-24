<script setup lang="ts">
import { ref, inject } from 'vue'
import { skills } from '../../portfolio'

// Panneau de configuration façon Windows XP (vue par catégories « Pick a
// category »), dont le contenu est la stack technique de Kevin : chaque groupe
// de compétences = une catégorie.
const openApp = inject<(id: string) => void>('openApp', () => {})

const view = ref<'category' | 'classic'>('category')

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

const categories = skills.map((s) => ({
  title: s.group,
  desc: s.items.join(', '),
  icon: groupIcons[s.group] || fallbackIcon,
}))
</script>

<template>
  <div class="cp">
    <!-- Barre de fonctions -->
    <div class="cp-funcbar">
      <div class="fb-btn disabled">
        <img src="/xp/windowsIcons/back.png" alt="" /><span>Précédent</span><i class="fb-arrow"></i>
      </div>
      <div class="fb-btn disabled">
        <img src="/xp/windowsIcons/forward.png" alt="" /><i class="fb-arrow"></i>
      </div>
      <div class="fb-btn"><img class="norm" src="/xp/windowsIcons/up.png" alt="Dossier parent" /></div>
      <div class="fb-sep"></div>
      <div class="fb-btn">
        <img class="norm" src="/xp/windowsIcons/299(32x32).png" alt="" /><span>Rechercher</span>
      </div>
      <div class="fb-btn">
        <img class="norm" src="/xp/windowsIcons/337(32x32).png" alt="" /><span>Dossiers</span>
      </div>
    </div>

    <!-- Barre d'adresse -->
    <div class="cp-address">
      <span class="lbl">Adresse</span>
      <div class="path">
        <img src="/xp/windowsIcons/300(32x32).png" class="mini" alt="" /> Panneau de configuration
      </div>
      <button class="go"><img src="/xp/ie/go.png" class="mini" alt="" /> Aller</button>
    </div>

    <div class="cp-body">
      <!-- Volet latéral -->
      <aside class="cp-side">
        <section class="cp-card">
          <p class="cp-card-title">Panneau de configuration</p>
          <a class="cp-link" @click="view = view === 'category' ? 'classic' : 'category'">
            <img src="/xp/windowsIcons/337(32x32).png" alt="" />
            <span>{{
              view === 'category'
                ? "Basculer vers l'affichage classique"
                : "Revenir à l'affichage des catégories"
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
          <h1 class="cp-h1">Choisir une catégorie</h1>
          <p class="cp-sub">Ma stack technique, du provisioning à l'observabilité.</p>
          <div class="cats">
            <div v-for="c in categories" :key="c.title" class="cat">
              <img :src="c.icon" alt="" />
              <span class="cat-text">
                <b>{{ c.title }}</b>
                <small>{{ c.desc }}</small>
              </span>
            </div>
          </div>
        </template>

        <!-- Vue classique (grille d'icônes) -->
        <template v-else>
          <div class="classic">
            <div v-for="c in categories" :key="c.title" class="tile">
              <img :src="c.icon" alt="" />
              <span>{{ c.title }}</span>
            </div>
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

/* Zone des catégories */
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
.cats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 26px;
}
.cat {
  display: flex;
  align-items: flex-start;
  gap: 12px;
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
.cat-text small {
  font-size: 11px;
  color: #e9efff;
}

/* Vue classique */
.classic {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  background: #fff;
  border: 1px solid #b9c8e3;
  border-radius: 4px;
  padding: 16px;
}
.tile {
  width: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}
.tile img {
  width: 32px;
  height: 32px;
  object-fit: contain;
}
.tile span {
  font-size: 11px;
  color: #1c3e8f;
}
</style>
