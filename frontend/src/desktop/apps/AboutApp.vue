<script setup lang="ts">
import { profile, about } from '../../portfolio'
</script>

<template>
  <div class="notepad">
    <div class="menubar">
      <span>Fichier</span><span>Édition</span><span>Format</span><span>Affichage</span><span>?</span>
    </div>
    <div class="paper">
      <p class="head">{{ profile.name }}</p>
      <p class="sub">{{ profile.role }} · {{ profile.location }}</p>
      <p v-for="(line, i) in about" :key="i">{{ line }}</p>
    </div>
  </div>
</template>

<style scoped>
.notepad {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.menubar {
  display: flex;
  gap: 14px;
  padding: 4px 8px;
  font-size: 12px;
  color: #1a1a1a;
  border-bottom: 1px solid #d6d3ce;
  flex-shrink: 0;
}
.menubar span {
  cursor: default;
}
.paper {
  flex: 1;
  overflow: auto;
  padding: 12px 14px;
  font-family: 'Lucida Console', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #111;
}
.head {
  font-weight: bold;
  margin: 0 0 2px;
}
.sub {
  color: #555;
  margin: 0 0 14px;
}
.paper p {
  margin: 0 0 10px;
}
</style>
