import { iframeGame, type GameDef } from '../types'

const game: GameDef = {
  id: 'solitaire',
  name: 'Solitaire',
  icon: '/xp/winxp-icons/solitaire.png',
  w: 700,
  h: 560,
  component: iframeGame('/games/solitaire/index.html'),
  newGame: '#js-reset',
  rules: {
    title: 'Règles du Solitaire',
    intro:
      'Le Solitaire (Klondike) : range les 52 cartes dans les quatre piles du haut (les « fondations »), une par couleur, de l’As au Roi.',
    sections: [
      {
        heading: 'Le plateau',
        lines: [
          'Sept colonnes au centre : seules les cartes du dessus, retournées, sont jouables.',
          'En haut à gauche : la pioche, où l’on tire de nouvelles cartes.',
          'En haut à droite : les quatre fondations à remplir (♠ ♥ ♦ ♣).',
        ],
      },
      {
        heading: 'Déplacer les cartes',
        lines: [
          'Dans les colonnes, on empile en descendant et en alternant les couleurs (rouge sur noir, noir sur rouge).',
          'Tu peux déplacer une carte seule ou toute une suite déjà ordonnée.',
          'Seul un Roi peut être posé sur une colonne vide.',
          'Découvre une carte cachée en libérant celle qui est posée dessus.',
        ],
      },
      {
        heading: 'Gagner',
        lines: [
          'Monte les cartes sur les fondations en commençant par l’As, puis 2, 3… jusqu’au Roi.',
          'Clique la pioche pour révéler de nouvelles cartes quand tu es bloqué.',
          'La partie est gagnée lorsque les quatre fondations sont complètes.',
        ],
      },
    ],
  },
}
export default game
