<script setup lang="ts">
import { projects } from '../../portfolio'
import { icons } from '../icons'
</script>

<template>
  <div class="explorer">
    <div class="addressbar">
      <span class="label">Adresse</span>
      <div class="path"><img :src="icons.folder" class="mini" alt="" /> C:\kevin\projets</div>
    </div>
    <div class="items">
      <a v-for="p in projects" :key="p.name" class="item" :href="p.url" target="_blank" rel="noopener">
        <img class="ico" :src="icons.folder" alt="" />
        <div class="meta">
          <span class="name">{{ p.name }}</span>
          <span class="desc">{{ p.desc }}</span>
          <span class="stack">{{ p.stack.join(' · ') }}</span>
        </div>
      </a>
    </div>
    <div class="statusbar">{{ projects.length }} objet(s)</div>
  </div>
</template>

<style scoped>
.explorer {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
}
.addressbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-bottom: 1px solid #d6d3ce;
  background: #f1efe7;
  flex-shrink: 0;
}
.addressbar .label {
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
.mini {
  width: 14px;
  height: 14px;
  object-fit: contain;
}
.ico {
  object-fit: contain;
}
.items {
  flex: 1;
  overflow: auto;
  padding: 6px;
}
.item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 10px;
  border-radius: 3px;
  text-decoration: none;
  color: #111;
}
.item:hover {
  background: #e8f0fe;
}
.ico {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}
.meta {
  display: flex;
  flex-direction: column;
}
.name {
  font-size: 13px;
  font-weight: bold;
  color: #1c4587;
}
.desc {
  font-size: 12px;
  color: #333;
}
.stack {
  font-size: 11px;
  color: #777;
  margin-top: 2px;
}
.statusbar {
  border-top: 1px solid #d6d3ce;
  background: #f1efe7;
  padding: 3px 8px;
  font-size: 11px;
  color: #555;
  flex-shrink: 0;
}
</style>
