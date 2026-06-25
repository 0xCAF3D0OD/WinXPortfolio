<script setup lang="ts">
import { ref, type Component } from 'vue'
import type { GameHelp } from '../games/types'

// Encadre un jeu : une barre de menu façon Windows XP (cf. 3D Pinball : « Game
// Options Help ») dont le menu « Help » ouvre les règles du jeu dans une vraie
// boîte de dialogue XP. Le jeu occupe tout l'espace en dessous.
const props = defineProps<{ component: Component; rules: GameHelp; newGame?: string }>()
const helpOpen = ref(false)
const root = ref<HTMLElement>()

// « New game » : pour un jeu en iframe (même origine), clique le bouton de
// nouvelle partie situé à l'intérieur de l'iframe.
function startNewGame() {
  if (!props.newGame) return
  const frame = root.value?.querySelector('iframe') as HTMLIFrameElement | null
  const btn = frame?.contentWindow?.document.querySelector(props.newGame) as HTMLElement | null
  btn?.click()
}
</script>

<template>
  <div ref="root" class="gframe">
    <!-- Barre de menu façon XP -->
    <div class="gframe-menu">
      <span v-if="newGame" class="gframe-item" @click="startNewGame">New game</span>
      <span class="gframe-item" :class="{ active: helpOpen }" @click="helpOpen = !helpOpen">Help</span>
    </div>

    <!-- Le jeu -->
    <div class="gframe-body">
      <component :is="component" />
    </div>

    <!-- Dialogue des règles : une vraie fenêtre XP au-dessus du jeu -->
    <div v-if="helpOpen" class="ghelp-overlay" @pointerdown.self="helpOpen = false">
      <div class="ghelp" role="dialog">
        <div class="ghelp-title">
          <span class="ghelp-title-text">
            <img src="/xp/start/help.png" alt="" />
            {{ rules.title || 'Règles du jeu' }}
          </span>
          <span
            class="ghelp-close"
            role="button"
            aria-label="Fermer"
            @click="helpOpen = false"
          ></span>
        </div>
        <div class="ghelp-body">
          <div class="ghelp-paper">
            <p v-if="rules.intro" class="ghelp-intro">{{ rules.intro }}</p>
            <section v-for="(s, i) in rules.sections" :key="i" class="ghelp-section">
              <h3>{{ s.heading }}</h3>
              <ul>
                <li v-for="(l, k) in s.lines" :key="k">{{ l }}</li>
              </ul>
            </section>
          </div>
        </div>
        <div class="ghelp-foot">
          <button type="button" class="ghelp-ok" @click="helpOpen = false">OK</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gframe {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ece9d8;
}

/* Barre de menu façon XP (« Game  Options  Help » dans 3D Pinball) */
.gframe-menu {
  flex-shrink: 0;
  display: flex;
  align-items: stretch;
  height: 21px;
  padding: 1px 3px;
  background: #f1f0e8;
  border-bottom: 1px solid #aca995;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 11px;
}
.gframe-item {
  display: inline-flex;
  align-items: center;
  padding: 0 7px;
  border: 1px solid transparent;
  color: #1a1a1a;
  cursor: default;
  user-select: none;
}
.gframe-item:hover,
.gframe-item.active {
  background: #2f71cd; /* surbrillance de menu Luna */
  border-color: #2f71cd;
  color: #fff;
}

/* Le jeu remplit le reste */
.gframe-body {
  flex: 1;
  min-height: 0;
  display: flex;
}
.gframe-body > :deep(*) {
  flex: 1;
  min-width: 0;
  min-height: 0;
}

/* Dialogue des règles : fenêtre XP modale au-dessus du jeu */
.ghelp-overlay {
  position: absolute;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.25);
  padding: 16px;
}
.ghelp {
  width: min(360px, 100%);
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: #ece9d8;
  border: 1px solid #0046d5;
  box-shadow: 2px 2px 9px rgba(0, 0, 0, 0.45);
  font-family: Tahoma, 'Noto Sans', sans-serif;
}

/* Barre de titre (mêmes valeurs que les vraies fenêtres) */
.ghelp-title {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 26px;
  padding: 0 2px 0 5px;
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  font-size: 12px;
  font-weight: bold;
  color: #fff;
  text-shadow: 1px 1px #0f1089;
  background: linear-gradient(
    180deg,
    #0997ff 0%,
    #0053ee 8%,
    #0050ee 40%,
    #0066ff 88%,
    #0066ff 93%,
    #005bff 95%,
    #003dd7 96%,
    #003dd7 100%
  );
}
.ghelp-title-text {
  display: flex;
  align-items: center;
  gap: 5px;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ghelp-title-text img {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

/* Bouton de fermeture : le vrai bouton rouge XP (cf. /xp/wnd/close.svg) */
.ghelp-close {
  flex-shrink: 0;
  width: 21px;
  height: 21px;
  background: #0050ee url('/xp/wnd/close.svg') center no-repeat;
  cursor: pointer;
}
.ghelp-close:hover {
  background-image: url('/xp/wnd/close-hover.svg');
}
.ghelp-close:active {
  background-image: url('/xp/wnd/close-active.svg');
}

/* Corps : à la manière des Propriétés d'affichage (zone de texte blanche) */
.ghelp-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px;
  background: #ece9d8;
}
.ghelp-paper {
  background: #fff;
  border: 1px solid #7f9db9;
  padding: 12px 14px;
  font-size: 12px;
  color: #1a1a1a;
}
.ghelp-intro {
  margin: 0 0 10px;
  line-height: 1.5;
}
.ghelp-section {
  margin-bottom: 10px;
}
.ghelp-section:last-child {
  margin-bottom: 0;
}
.ghelp-section h3 {
  margin: 0 0 4px;
  font-size: 13px;
  color: #0a3d91;
}
.ghelp-section ul {
  margin: 0;
  padding-left: 20px;
  line-height: 1.5;
}
.ghelp-section li {
  margin-bottom: 3px;
}

/* Pied : bouton OK aligné à droite (convention XP) */
.ghelp-foot {
  flex-shrink: 0;
  display: flex;
  justify-content: flex-end;
  padding: 8px 10px;
  background: #ece9d8;
}
.ghelp-ok {
  min-width: 75px;
}
</style>
