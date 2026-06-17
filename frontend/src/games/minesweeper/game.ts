import type { GameDef } from '../types'
import MinesweeperApp from '../../desktop/apps/MinesweeperApp.vue'

const game: GameDef = {
  id: 'minesweeper',
  name: 'Démineur',
  icon: '/xp/icons/mine.svg',
  w: 264,
  h: 350,
  component: MinesweeperApp,
}
export default game
