import { ref } from 'vue'

// État muet partagé entre la zone de notification (icône volume) et les effets.
export const muted = ref(false)

const files = {
  error: '/xp/sounds/error.wav',
  ding: '/xp/sounds/ding.wav',
  recycle: '/xp/sounds/recycle.wav',
  minimize: '/xp/sounds/minimize.wav',
  restore: '/xp/sounds/restore.wav',
  menu: '/xp/sounds/menu.wav',
}
export type SoundName = keyof typeof files

const cache: Partial<Record<SoundName, HTMLAudioElement>> = {}

export function playSound(name: SoundName) {
  if (muted.value) return
  try {
    let audio = cache[name]
    if (!audio) {
      audio = new Audio(files[name])
      cache[name] = audio
    }
    audio.currentTime = 0
    void audio.play().catch(() => {})
  } catch {
    /* ignore */
  }
}
