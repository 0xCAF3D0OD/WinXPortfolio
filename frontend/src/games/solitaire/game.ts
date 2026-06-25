import { iframeGame } from '../types'
export default {
  id: 'solitaire',
  name: 'Solitaire',
  icon: '/xp/winxp-icons/solitaire.png',
  w: 700,
  h: 560,
  component: iframeGame('/games/solitaire/index.html'),
}
