<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'

const emit = defineEmits<{ done: [] }>()
let timer: number

onMounted(() => {
  timer = window.setTimeout(() => emit("done"), 4200)
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <div class="loading" @click="emit('done')">
    <div class="brand">
      <div class="logo">
        <img class="flag" src="/xp/windoors_flou_pixel.svg" alt="" />
        <span class="tag-tech">0xCAF3D0OD<i>®</i></span>
        <span class="wordmark"
          ><b><span class="initiale">W</span>indoors</b><i>DK</i></span
        >
      </div>
    </div>
    <div class="container">
      <div class="box"></div>
      <div class="box"></div>
      <div class="box"></div>
    </div>
    <button class="skip" @click.stop="emit('done')">passer</button>
  </div>
</template>

<style scoped>

.loading {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 46px;
  font-family: Tahoma, sans-serif;
  user-select: none;
  cursor: default;
}
.brand {
  justify-self: end;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  position: relative;
  top: -4px;
}
.brand .logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
/* 2. On place le tag où on veut sans faire bouger le reste */
.tag-tech {
  position: absolute;
  top: 130px; /* Ajuste cette valeur pour monter/descendre par rapport au drapeau */
  right: 160px; /* Propulse le texte sur la droite du logo */

  font-family: Tahoma, sans-serif; /* Style très "DevOps / adresse mémoire" */
  font-size: 12px;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
.tag-tech i {
  font-size: 6px;
  font-style: normal;
  transform: translateY(-25px);
  display: inline-block; /* Nécessaire pour que le transform s'applique correctement */
}
.brand .logo .flag {
  width: 186px;
  height: 137px;
  margin-left: 60px;
  filter: drop-shadow(1px 2px 4px rgba(0, 0, 0, 0.45));
}
.brand .wordmark {
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-family: Tahoma, sans-serif;
  /* léger flou type ClearType d'origine */
  text-shadow:
    0 0 1px rgba(255, 255, 255, 0.6),
    1px 2px 3px rgba(0, 0, 0, 0.4);
  filter: blur(0.4px);
}
.brand .wordmark b {
  font-size: 40px;
  font-weight: 600;
  color: #fff;
}

.initiale {
  font-size: 1.5em; /* Taille agrandie */
  display: inline-block;
  line-height: 0.8; /* Réduit l'espace autour de la lettre pour un meilleur contrôle */
  vertical-align: baseline; /* Force l'alignement sur le bas du texte */
}
.brand .wordmark i {
  font-size: 25px; /* On réduit la taille (environ la moitié de la taille de Windoors) */
  font-weight: 400;
  font-style: normal;
  color: #ff6600; /* Orange XP */

  /* C'est ici que la magie opère pour l'effet de puissance : */
  transform: translateY(-16px);
  display: inline-block; /* Nécessaire pour que le transform s'applique correctement */
}
/* box-sizing content-box : indispensable car l'app a un * { box-sizing: border-box }
   global qui, sinon, écrase la hauteur utile de la barre (boîtes invisibles). */
.container {
  width: 200px;
  height: 14px;
  box-sizing: content-box;
  border: 2px solid #b2b2b2;
  border-radius: 7px;
  margin: 0 auto;
  padding: 2px 1px;
  overflow: hidden;
  font-size: 0;
}
.container .box {
  box-sizing: content-box;
  width: 9px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    #2838c7 0%,
    #5979ef 17%,
    #869ef3 32%,
    #869ef3 45%,
    #5979ef 59%,
    #2838c7 100%
  );
  display: inline-block;
  margin-right: 2px;
  animation: loader 2.2s infinite linear;
}
@keyframes loader {
  0% {
    transform: translateX(-30px);
  }
  100% {
    transform: translateX(200px);
  }
}

.skip {
  position: absolute;
  bottom: 22px;
  right: 22px;
  background: transparent;
  border: 1px solid #444;
  color: #777;
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 3px;
  cursor: pointer;
}
</style>
