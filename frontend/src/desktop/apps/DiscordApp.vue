<script setup lang="ts">
import { computed } from 'vue'

// MSN — intègre le widget Discord officiel de Kevin.
//
// ⚠️ À RENSEIGNER : mets ici l'ID de ton serveur Discord (clic droit sur le
// serveur → « Copier l'identifiant », mode développeur activé). Et active le
// widget côté Discord : Paramètres du serveur → Widget → « Activer le widget ».
const DISCORD_SERVER_ID = '1519700730435604480'

const widgetUrl = computed(() =>
  DISCORD_SERVER_ID ? `https://discord.com/widget?id=${DISCORD_SERVER_ID}&theme=dark` : '',
)
</script>

<template>
  <div class="msn">
    <!-- En-tête façon MSN -->
    <header class="msn-head">
      <img src="/xp/msn/msnlogo.png" alt="MSN" />
      <span>Mon Discord</span>
    </header>

    <!-- Widget Discord intégré -->
    <div class="msn-body">
      <iframe
        v-if="widgetUrl"
        :src="widgetUrl"
        title="Discord"
        allowtransparency="true"
        frameborder="0"
        sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
      ></iframe>
      <div v-else class="msn-setup">
        <img src="/xp/msn/windowsmesenger.png" alt="" />
        <p class="msn-setup-title">Widget Discord à configurer</p>
        <p class="msn-setup-text">
          Renseigne l'ID de ton serveur dans
          <code>DiscordApp.vue</code> (constante <code>DISCORD_SERVER_ID</code>) et active le widget
          côté Discord, puis le salon apparaîtra ici.
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.msn {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
}
.msn-head {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  font-weight: bold;
  color: #15317e;
  background: linear-gradient(to bottom, #eaf3ff, #cfe4fb);
  border-bottom: 1px solid #9cc0e9;
  flex-shrink: 0;
}
.msn-head img {
  height: 26px;
}
.msn-body {
  flex: 1;
  min-height: 0;
  background: #36393f;
}
.msn-body iframe {
  width: 100%;
  height: 100%;
  border: 0;
  display: block;
}
.msn-setup {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 24px;
  text-align: center;
  background: #fff;
  color: #333;
}
.msn-setup img {
  width: 48px;
  height: 48px;
  opacity: 0.7;
}
.msn-setup-title {
  margin: 0;
  font-size: 14px;
  font-weight: bold;
  color: #15317e;
}
.msn-setup-text {
  margin: 0;
  max-width: 360px;
  font-size: 12px;
  line-height: 1.5;
}
.msn-setup code {
  background: #eef2fb;
  border: 1px solid #d3def0;
  border-radius: 3px;
  padding: 0 3px;
  font-size: 11px;
}
</style>
