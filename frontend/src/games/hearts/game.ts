import { iframeGame, type GameDef } from '../types'

const game: GameDef = {
  id: 'hearts',
  name: 'Hearts',
  icon: '/xp/winxp-icons/heart.png', // déjà présent dans tes assets
  w: 1000,
  h: 600,
  component: iframeGame('/games/hearts/index.html'),
  rules: {
    title: 'Règles du Hearts',
    intro:
      'Jeu de cartes à 4 joueurs (toi et trois adversaires gérés par l’ordinateur). Le but est d’éviter de ramasser des points : c’est le score le plus BAS qui gagne.',
    sections: [
      {
        heading: 'Les points à éviter',
        lines: [
          'Chaque carte de cœur (♥) ramassée vaut 1 point.',
          'La Dame de pique (♠ Q) vaut 13 points.',
          'Soit 26 points en jeu à chaque manche.',
        ],
      },
      {
        heading: 'Le déroulement',
        lines: [
          'Au début de chaque manche, tu passes 3 cartes à un adversaire (le sens change à chaque manche).',
          'On joue ensuite des plis : tu dois fournir la couleur demandée si tu en as une.',
          'Celui qui pose la plus forte carte de la couleur demandée remporte le pli… et ses points.',
          'Tu ne peux pas entamer à cœur tant qu’un cœur n’a pas été joué (« cœurs brisés »).',
        ],
      },
      {
        heading: 'Astuce & fin de partie',
        lines: [
          '« Faire la lune » : si tu ramasses à toi seul les 26 points, tu marques 0 et les autres prennent 26.',
          'La partie s’arrête dès qu’un joueur atteint 100 points ; le plus bas score l’emporte.',
        ],
      },
    ],
  },
}
export default game
