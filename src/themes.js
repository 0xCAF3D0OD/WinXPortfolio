// Palettes du terminal. Chaque thème mappe les variables CSS utilisées dans style.css.
export const themes = {
  github: {
    '--bg': '#0d1117', '--bg-bar': '#161b22', '--fg': '#c9d1d9', '--dim': '#8b949e',
    '--accent': '#7ee787', '--prompt': '#58a6ff', '--path': '#a371f7', '--link': '#79c0ff',
    '--err': '#ff7b72', '--ok': '#d2a8ff', '--banner': '#39d353',
  },
  dracula: {
    '--bg': '#282a36', '--bg-bar': '#21222c', '--fg': '#f8f8f2', '--dim': '#6272a4',
    '--accent': '#50fa7b', '--prompt': '#bd93f9', '--path': '#ff79c6', '--link': '#8be9fd',
    '--err': '#ff5555', '--ok': '#f1fa8c', '--banner': '#bd93f9',
  },
  solarized: {
    '--bg': '#002b36', '--bg-bar': '#073642', '--fg': '#93a1a1', '--dim': '#586e75',
    '--accent': '#859900', '--prompt': '#268bd2', '--path': '#6c71c4', '--link': '#2aa198',
    '--err': '#dc322f', '--ok': '#b58900', '--banner': '#2aa198',
  },
  matrix: {
    '--bg': '#000800', '--bg-bar': '#001000', '--fg': '#00ff66', '--dim': '#0a8f3c',
    '--accent': '#39ff14', '--prompt': '#00ff66', '--path': '#00cc52', '--link': '#7fff9f',
    '--err': '#ff5555', '--ok': '#aaffaa', '--banner': '#39ff14',
  },
}

export const themeNames = Object.keys(themes)
const STORAGE_KEY = 'portfolio-theme'

export function applyTheme(name) {
  const theme = themes[name]
  if (!theme) return false
  for (const [key, value] of Object.entries(theme)) {
    document.documentElement.style.setProperty(key, value)
  }
  localStorage.setItem(STORAGE_KEY, name)
  return true
}

export function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && themes[saved]) {
    applyTheme(saved)
    return saved
  }
  return 'github'
}
