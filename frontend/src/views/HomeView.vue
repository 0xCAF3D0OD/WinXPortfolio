<script setup lang="ts">
import { ref } from 'vue'
import LoadingScreen from '../desktop/LoadingScreen.vue'
import LoginScreen from '../desktop/LoginScreen.vue'
import XpDesktop from '../desktop/XpDesktop.vue'

type Stage = 'loading' | 'login' | 'desktop'
const stage = ref<Stage>('loading')
</script>

<template>
  <LoadingScreen v-if="stage === 'loading'" @done="stage = 'login'" />
  <LoginScreen v-else-if="stage === 'login'" @done="stage = 'desktop'" />
  <XpDesktop v-else @logoff="stage = 'login'" />
</template>
