<script setup lang="ts">
import { skills } from '../../portfolio'
</script>

<template>
  <div class="skills">
    <div class="grid">
      <div v-for="s in skills" :key="s.group" class="card">
        <p class="title">{{ s.group }}</p>
        <ul>
          <li v-for="it in s.items" :key="it">{{ it }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skills {
  height: 100%;
  overflow: auto;
  background: #fff;
  padding: 12px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}
.card {
  border: 1px solid #c9ccd1;
  border-radius: 3px;
  background: #f8f8f5;
  padding: 8px 10px;
}
.title {
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: bold;
  color: #1c4587;
  border-bottom: 1px solid #dcdcd6;
  padding-bottom: 4px;
}
ul {
  margin: 0;
  padding-left: 16px;
}
li {
  font-size: 12px;
  color: #222;
  line-height: 1.6;
}
</style>
