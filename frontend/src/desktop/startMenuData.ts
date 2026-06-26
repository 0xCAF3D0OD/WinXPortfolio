export type StartMenuEntry =
  | {
      type: 'item'
      label: string
      icon: string
      app?: string | null
      subtext?: string
    }
  | {
      type: 'menu'
      label: string
      icon: string
      items: StartMenuEntry[]
    }
  | {
      type: 'separator'
    }

const xpIcon = (name: string) => `/xp/winxp-icons/${name}`

export const recentDocumentsMenu: StartMenuEntry[] = [
  { type: 'item', icon: xpIcon('empty.png'), label: '(Vide)' },
]

export const connectToMenu: StartMenuEntry[] = [
  { type: 'item', icon: xpIcon('159(16x16).png'), label: 'MSN', app: 'msn' },
  { type: 'item', icon: xpIcon('309(16x16).png'), label: 'Afficher toutes les connexions' },
]

export const allProgramsMenu: StartMenuEntry[] = [
  { type: 'item', icon: xpIcon('227(16x16).png'), label: 'Configurer les programmes par défaut' },
  { type: 'item', icon: xpIcon('392(16x16).png'), label: 'Catalogue Windows' },
  { type: 'item', icon: xpIcon('322(16x16).png'), label: 'Windows Update' },
  { type: 'separator' },
  {
    type: 'menu',
    icon: xpIcon('358(16x16).png'),
    label: 'Accessoires',
    items: [
      {
        type: 'menu',
        icon: xpIcon('358(16x16).png'),
        label: 'Accessibilité',
        items: [
          { type: 'item', icon: xpIcon('238(16x16).png'), label: 'Assistant Accessibilité' },
          { type: 'item', icon: xpIcon('817(16x16).png'), label: 'Loupe' },
          { type: 'item', icon: xpIcon('narrator.ico'), label: 'Narrateur' },
          { type: 'item', icon: xpIcon('58(16x16).png'), label: 'Clavier visuel' },
          { type: 'item', icon: xpIcon('119(16x16).png'), label: "Gestionnaire d'utilitaires" },
        ],
      },
      {
        type: 'menu',
        icon: xpIcon('358(16x16).png'),
        label: 'Communications',
        items: [
          { type: 'item', icon: xpIcon('669(16x16).png'), label: 'HyperTerminal', app: 'terminal' },
          { type: 'item', icon: xpIcon('404(16x16).png'), label: 'Connexions réseau' },
          {
            type: 'item',
            icon: xpIcon('664(16x16).png'),
            label: 'Assistant Configuration du réseau',
          },
          { type: 'item', icon: xpIcon('663(16x16).png'), label: 'Assistant Nouvelle connexion' },
          {
            type: 'item',
            icon: xpIcon('234(16x16).png'),
            label: 'Assistant Réseau sans fil',
          },
        ],
      },
      {
        type: 'menu',
        icon: xpIcon('358(16x16).png'),
        label: 'Divertissement',
        items: [
          { type: 'item', icon: xpIcon('690(16x16).png'), label: 'Magnétophone' },
          { type: 'item', icon: xpIcon('120(16x16).png'), label: 'Contrôle du volume' },
          { type: 'item', icon: xpIcon('846(16x16).png'), label: 'Lecteur Windows Media' },
          { type: 'item', icon: xpIcon('winamp.png'), label: 'Winamp', app: 'webamp' },
        ],
      },
      {
        type: 'menu',
        icon: xpIcon('358(16x16).png'),
        label: 'Outils système',
        items: [
          { type: 'item', icon: xpIcon('23(16x16).png'), label: 'Sauvegarde' },
          { type: 'item', icon: xpIcon('127(16x16).png'), label: 'Table des caractères' },
          { type: 'item', icon: xpIcon('128(16x16).png'), label: 'Nettoyage de disque' },
          { type: 'item', icon: xpIcon('374(16x16).png'), label: 'Défragmenteur de disque' },
          {
            type: 'item',
            icon: xpIcon('367(16x16).png'),
            label: 'Assistant Transfert de fichiers et de paramètres',
          },
          { type: 'item', icon: xpIcon('716(16x16).png'), label: 'Tâches planifiées' },
          { type: 'item', icon: xpIcon('214(16x16).png'), label: 'Centre de sécurité' },
          { type: 'item', icon: xpIcon('505(16x16).png'), label: 'Informations système' },
          { type: 'item', icon: xpIcon('restore.ico'), label: 'Restauration du système' },
        ],
      },
      { type: 'item', icon: xpIcon('554(16x16).png'), label: "Carnet d'adresses" },
      { type: 'item', icon: xpIcon('56(16x16).png'), label: 'Invite de commandes', app: 'terminal' },
      { type: 'item', icon: xpIcon('327(16x16).png'), label: 'Bloc-notes', app: 'about' },
      { type: 'item', icon: xpIcon('680(16x16).png'), label: 'Paint' },
      { type: 'item', icon: xpIcon('74(16x16).png'), label: 'Calculatrice' },
      {
        type: 'item',
        icon: xpIcon('747(16x16).png'),
        label: 'Assistant Compatibilite des programmes',
      },
      { type: 'item', icon: xpIcon('rdp.png'), label: 'Connexion Bureau a distance' },
      { type: 'item', icon: xpIcon('182(16x16).png'), label: 'Synchroniser' },
      { type: 'item', icon: xpIcon('853(32x32).png'), label: 'Visite guidée de Windows XP' },
      {
        type: 'item',
        icon: xpIcon('156(16x16).png'),
        label: 'Explorateur Windows',
        app: 'mycomputer',
      },
      { type: 'item', icon: xpIcon('153(16x16).png'), label: 'WordPad' },
    ],
  },
  {
    type: 'menu',
    icon: xpIcon('358(16x16).png'),
    label: 'Jeux',
    items: [
      { type: 'item', icon: xpIcon('freecell.png'), label: 'FreeCell' },
      { type: 'item', icon: xpIcon('heart.png'), label: 'Hearts', app: 'game-hearts' },
      { type: 'item', icon: xpIcon('892(16x16).png'), label: 'Internet Backgammon' },
      { type: 'item', icon: xpIcon('891(16x16).png'), label: 'Internet Checkers' },
      { type: 'item', icon: xpIcon('890(16x16).png'), label: 'Internet Hearts' },
      { type: 'item', icon: xpIcon('889(16x16).png'), label: 'Internet Reversi' },
      { type: 'item', icon: xpIcon('888(16x16).png'), label: 'Internet Spades' },
      {
        type: 'item',
        icon: '/xp/winxp-icons/minesweeper/mine-icon.png',
        label: 'Minesweeper',
        app: 'game-minesweeper',
      },
      { type: 'item', icon: xpIcon('pinball.png'), label: 'Pinball', app: 'game-pinball' },
      { type: 'item', icon: xpIcon('890(16x16).png'), label: 'Internet Pinball' },
      { type: 'item', icon: xpIcon('solitaire.png'), label: 'Solitaire', app: 'game-solitaire' },
      { type: 'item', icon: xpIcon('spider.png'), label: 'Spider Solitaire' },
      { type: 'item', icon: '/xp/icons/morpion.svg', label: 'Morpion', app: 'game-morpion' },
    ],
  },
  {
    type: 'menu',
    icon: xpIcon('358(16x16).png'),
    label: 'Démarrage',
    items: [{ type: 'item', icon: xpIcon('empty.png'), label: '(Vide)' }],
  },
  { type: 'item', icon: xpIcon('896(16x16).png'), label: 'Internet Explorer', app: 'iexplorer' },
  { type: 'item', icon: xpIcon('887(16x16).png'), label: 'Outlook Express', app: 'guestbook' },
  { type: 'item', icon: xpIcon('357(16x16).png'), label: 'Assistance à distance' },
  { type: 'item', icon: xpIcon('846(16x16).png'), label: 'Lecteur Windows Media' },
  { type: 'item', icon: xpIcon('winamp.png'), label: 'Winamp', app: 'webamp' },
  { type: 'item', icon: xpIcon('msn.png'), label: 'Windows Messenger', app: 'messenger' },
  { type: 'item', icon: xpIcon('894(16x16).png'), label: 'Windows Movie Maker' },
]
