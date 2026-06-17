import { markRaw } from 'vue'
import type { GameDef } from './types'

// Découverte automatique des jeux : chaque src/games/<nom>/game.ts qui exporte
// par défaut un GameDef est inclus ici sans modification de code ailleurs.
const modules = import.meta.glob('./*/game.ts', { eager: true }) as Record<
  string,
  { default: GameDef }
>

export const games: GameDef[] = Object.values(modules)
  .map((m) => ({ ...m.default, component: markRaw(m.default.component) }))
  .sort((a, b) => a.name.localeCompare(b.name))
