import type { GameDef } from '../types'
import Morpion from './Morpion.vue'

const game: GameDef = {
  id: 'morpion',
  name: 'Morpion',
  icon: '/xp/icons/morpion.svg',
  w: 240,
  h: 300,
  component: Morpion,
}
export default game
