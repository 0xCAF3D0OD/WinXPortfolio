import { defineComponent, h, type Component } from 'vue'

// Définition d'un jeu. Chaque jeu vit dans src/games/<nom>/ et exporte par défaut
// un GameDef depuis un fichier `game.ts`. Il est découvert automatiquement (voir registry.ts).
// Aide / règles d'un jeu, affichées via le bouton « ? » au-dessus du jeu.
export interface GameHelp {
  title?: string
  intro?: string
  sections: { heading: string; lines: string[] }[]
}

export interface GameDef {
  id: string
  name: string
  icon?: string // chemin vers une icône (public/), sinon une icône par défaut
  w?: number
  h?: number
  component: Component // composant Vue du jeu
  rules?: GameHelp // règles affichées par le bouton « ? » (absent = pas d'aide)
  // Pour un jeu en iframe : sélecteur du bouton « nouvelle partie » à l'intérieur
  // de l'iframe. S'il est fourni, le cadre ajoute un item « New game » dans son
  // bandeau qui clique ce bouton (même origine).
  newGame?: string
}

// Aide pour intégrer un jeu HTML5 externe via une iframe.
// Usage dans game.ts : component: iframeGame('https://exemple.com/mon-jeu/')
export function iframeGame(url: string): Component {
  return defineComponent({
    name: 'IframeGame',
    render: () =>
      h('iframe', {
        src: url,
        style: 'width:100%;height:100%;border:0;display:block;background:#000',
        allow: 'autoplay; fullscreen; gamepad',
      }),
  })
}
