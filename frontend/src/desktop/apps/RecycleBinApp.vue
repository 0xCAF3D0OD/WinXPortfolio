<script setup lang="ts"></script>

<template>
  <div class="bin">
    <p>La Corbeille est vide.</p>
  </div>
</template>

<style scoped>
.bin {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fff;
  color: #555;
}
.bin p {
  margin: 0;
  font-size: 13px;
}
.bin small {
  font-size: 11px;
  color: #999;
}
</style>
