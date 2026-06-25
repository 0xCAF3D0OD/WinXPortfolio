import { profile, projects } from '../portfolio'

// Mini « système de fichiers » statique (pas de store réactif, pas de filesystem
// distant) : un simple arbre de nœuds indexés par id, chacun connaissant son
// parent et ses enfants. L'Explorer générique (MyComputerApp) le parcourt comme
// un vrai Poste de travail : Poste de travail → C: → Projets, etc.
export type FsType = 'computer' | 'drive' | 'folder' | 'app' | 'link' | 'device'

export interface FsNode {
  id: string
  name: string
  type: FsType
  icon: string
  parent?: string
  children?: string[] // pour les conteneurs (computer / drive / folder)
  open?: string // pour type 'app' : id d'application à ouvrir (openApp)
  href?: string // pour type 'link' : URL externe
  detail?: string // petite ligne secondaire (vue mosaïque)
  free?: string // pour les disques
  pct?: number // pour les disques (jauge d'occupation)
}

const FOLDER = '/xp/win/folder.png'

const ghUrl = profile.github
const liUrl = profile.linkedin.startsWith('http') ? profile.linkedin : `https://${profile.linkedin}`

// Les projets du portfolio deviennent des éléments du dossier « Projets ».
const projectNodes: FsNode[] = projects.map((p, i) => ({
  id: `proj-${i}`,
  name: p.name,
  type: 'link',
  icon: FOLDER,
  parent: 'projects',
  href: p.url,
  detail: p.desc,
}))

const nodes: FsNode[] = [
  {
    id: 'computer',
    name: 'Poste de travail',
    type: 'computer',
    icon: '/xp/win/computer16.png',
    children: ['projects', 'about', 'cdrive', 'ddrive', 'cd', 'gh', 'li', 'contact'],
  },
  {
    id: 'cdrive',
    name: 'Disque local (C:)',
    type: 'drive',
    icon: '/xp/win/disk.png',
    parent: 'computer',
    free: '34,2 Go libres sur 80,0 Go',
    pct: 58,
    children: ['projects', 'about'],
  },
  {
    id: 'ddrive',
    name: 'Données (D:)',
    type: 'drive',
    icon: '/xp/win/disk.png',
    parent: 'computer',
    free: '120 Go libres sur 250 Go',
    pct: 52,
    children: [],
  },
  { id: 'cd', name: 'Lecteur CD (E:)', type: 'device', icon: '/xp/win/cd.png', parent: 'computer' },

  // Dossiers / fichiers de C:
  {
    id: 'projects',
    name: 'Projets',
    type: 'folder',
    icon: FOLDER,
    parent: 'cdrive',
    children: projectNodes.map((n) => n.id),
  },
  {
    id: 'about',
    name: 'À propos de Kevin',
    type: 'app',
    icon: '/xp/icons/notepad(32x32).png',
    parent: 'cdrive',
    open: 'about',
  },

  // Raccourcis « À propos de moi » visibles sur le Poste de travail
  { id: 'gh', name: 'GitHub', type: 'link', icon: '/xp/windowsIcons/earth.png', parent: 'computer', href: ghUrl },
  { id: 'li', name: 'LinkedIn', type: 'link', icon: '/xp/windowsIcons/links.png', parent: 'computer', href: liUrl },
  {
    id: 'contact',
    name: 'Me contacter',
    type: 'app',
    icon: '/xp/start/emailoutlook.png',
    parent: 'computer',
    open: 'guestbook',
  },

  ...projectNodes,
]

export const fsTree: Record<string, FsNode> = Object.fromEntries(nodes.map((n) => [n.id, n]))

// Chemin lisible façon barre d'adresse XP : « Poste de travail \ Disque local (C:) \ Projets ».
export function fsPath(id: string): string {
  const parts: string[] = []
  let cur: FsNode | undefined = fsTree[id]
  while (cur) {
    parts.unshift(cur.name)
    cur = cur.parent ? fsTree[cur.parent] : undefined
  }
  return parts.join(' \\ ')
}
