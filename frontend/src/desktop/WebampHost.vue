<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { initialTracks } from '@/desktop/config.ts'
// Winamp (Webamp) monté directement dans la page (pas d'iframe) : ses fenêtres
// sont de vrais éléments DOM, déplaçables et redimensionnables partout sur le
// bureau, façon winamp.org. Le conteneur laisse passer les clics (pointer-events
// none) sauf sur les fenêtres de Winamp → le reste du bureau reste utilisable.
const emit = defineEmits<{ close: [] }>()
const host = ref<HTMLElement>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let webamp: any = null

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve()
    const s = document.createElement('script')
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => reject(new Error('Échec du chargement : ' + src))
    document.head.appendChild(s)
  })
}

onMounted(async () => {
  try {
    await loadScript('https://unpkg.com/webamp@1.5.0/built/webamp.bundle.min.js')
    await loadScript('https://unpkg.com/butterchurn@2.6.7/lib/butterchurn.min.js')
    await loadScript('https://unpkg.com/butterchurn-presets@2.4.7/lib/butterchurnPresets.min.js')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const Webamp = w.Webamp
    if (!Webamp || !Webamp.browserIsSupported() || !host.value) {
      emit('close')
      return
    }
    webamp = new Webamp({
      initialTracks,
      // Visualiseur Milkdrop (Butterchurn), comme sur winamp.org
      __butterchurnOptions: {
        importButterchurn: () => Promise.resolve(w.butterchurn),
        getPresets: () => {
          const presets = w.butterchurnPresets.getPresets()
          return Object.keys(presets).map((name) => ({
            name,
            butterchurnPresetObject: presets[name],
          }))
        },
        butterchurnOpen: true,
      },
    })
    webamp.onClose(() => emit('close'))
    await webamp.renderWhenReady(host.value)
  } catch {
    emit('close')
  }
})

onBeforeUnmount(() => {
  if (webamp) {
    try {
      webamp.dispose()
    } catch {
      /* noop */
    }
    webamp = null
  }
})
</script>

<template>
  <!-- Simple ancre de cycle de vie : Webamp s'attache lui-même à <body>. -->
  <div ref="host" class="webamp-host"></div>
</template>

<style scoped>
.webamp-host {
  display: none;
}
</style>

<style>
/* Webamp se monte sur <body> (hors du composant) → styles globaux.
   Au-dessus des fenêtres XP, sous la barre des tâches / le menu Démarrer ;
   les zones vides laissent passer les clics, seules les fenêtres Winamp les captent. */
#webamp {
  z-index: 9000 !important;
  pointer-events: none;
}
#webamp .window {
  pointer-events: auto;
}
</style>
