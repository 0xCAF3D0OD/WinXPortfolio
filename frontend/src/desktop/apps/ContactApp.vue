<script setup lang="ts">
import { profile } from '../../portfolio'
import { icons } from '../icons'

const links = [
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}`, icon: icons.mail },
  { label: 'GitHub', value: profile.github, href: profile.github, icon: icons.folder },
  { label: 'LinkedIn', value: profile.linkedin, href: profile.linkedin, icon: icons.notepad },
]
</script>

<template>
  <div class="contact">
    <p class="intro">N'hésite pas à me contacter :</p>
    <a v-for="l in links" :key="l.label" class="row" :href="l.href" target="_blank" rel="noopener">
      <img class="ico" :src="l.icon" alt="" />
      <div class="meta">
        <span class="label">{{ l.label }}</span>
        <span class="value">{{ l.value }}</span>
      </div>
    </a>
  </div>
</template>

<style scoped>
.contact {
  height: 100%;
  overflow: auto;
  background: #fff;
  padding: 14px;
}
.intro {
  margin: 0 0 12px;
  font-size: 13px;
  color: #222;
}
.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 10px;
  border: 1px solid #d6d3ce;
  border-radius: 3px;
  text-decoration: none;
  color: #111;
  margin-bottom: 8px;
  background: #f8f8f5;
}
.row:hover {
  background: #e8f0fe;
}
.ico {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}
.ico {
  object-fit: contain;
}
.meta {
  display: flex;
  flex-direction: column;
}
.label {
  font-size: 12px;
  font-weight: bold;
  color: #1c4587;
}
.value {
  font-size: 12px;
  color: #444;
}
</style>
