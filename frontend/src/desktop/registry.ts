import type { Component } from 'vue'
import TerminalConsole from '../components/TerminalConsole.vue'
import AboutApp from './apps/AboutApp.vue'
import ProjectsApp from './apps/ProjectsApp.vue'
import SkillsApp from './apps/SkillsApp.vue'
import ContactApp from './apps/ContactApp.vue'
import GuestbookApp from './apps/GuestbookApp.vue'
import IExplorerApp from './apps/IExplorerApp.vue'
import MsnApp from './apps/MsnApp.vue'
import MyComputerApp from './apps/MyComputerApp.vue'
import RecycleBinApp from './apps/RecycleBinApp.vue'
import { icons } from './icons'
import { games } from '../games/registry'
import { pdfViewer } from './pdfViewer'

export interface AppDef {
  id: string
  label: string // texte sous l'icône / dans le menu
  title: string // titre de la fenêtre
  icon: string
  component: Component
  w: number
  h: number
}

export const apps: AppDef[] = [
  {
    id: 'iexplorer',
    label: 'Internet',
    title: 'Portfolio — Internet Explorer',
    icon: icons.iexplorer,
    component: IExplorerApp,
    w: 740,
    h: 540,
  },
  {
    id: 'terminal',
    label: 'Terminal',
    title: 'kevin@cloud — Invite de commandes',
    icon: icons.terminal,
    component: TerminalConsole,
    w: 720,
    h: 460,
  },
  {
    id: 'about',
    label: 'À propos.txt',
    title: 'À propos.txt — Bloc-notes',
    icon: icons.notepad,
    component: AboutApp,
    w: 560,
    h: 420,
  },
  {
    id: 'projects',
    label: 'Projets',
    title: 'Projets',
    icon: icons.folder,
    component: ProjectsApp,
    w: 620,
    h: 440,
  },
  {
    id: 'skills',
    label: 'Compétences',
    title: 'Compétences',
    icon: icons.gear,
    component: SkillsApp,
    w: 540,
    h: 420,
  },
  {
    id: 'contact',
    label: 'Contact',
    title: 'Contact',
    icon: icons.mail,
    component: ContactApp,
    w: 460,
    h: 340,
  },
  {
    id: 'guestbook',
    label: 'Me contacter',
    title: 'Nouveau message — Outlook Express',
    icon: icons.outlook,
    component: GuestbookApp,
    w: 560,
    h: 460,
  },
  {
    id: 'msn',
    label: 'MSN Messenger',
    title: 'MSN Messenger',
    icon: icons.msn,
    component: MsnApp,
    w: 330,
    h: 480,
  },
  {
    id: 'cv-fr',
    label: 'Dossier de candidature.pdf',
    title: 'Dossier de candidature (FR) — Adobe Reader',
    icon: icons.pdf,
    component: pdfViewer('/cv/dossier-candidature-fr.pdf'),
    w: 780,
    h: 580,
  },
  {
    id: 'cv-en',
    label: 'Candidate folder.pdf',
    title: 'Candidate folder (EN) — Adobe Reader',
    icon: icons.pdf,
    component: pdfViewer('/cv/candidate-folder-en.pdf'),
    w: 780,
    h: 580,
  },
  {
    id: 'mycomputer',
    label: 'Poste de travail',
    title: 'Poste de travail',
    icon: icons.computer,
    component: MyComputerApp,
    w: 620,
    h: 440,
  },
  {
    id: 'bin',
    label: 'Corbeille',
    title: 'Corbeille',
    icon: icons.bin,
    component: RecycleBinApp,
    w: 420,
    h: 280,
  },
  // Jeux découverts dans src/games/ : chacun arrive sur le bureau avec sa
  // propre icône (le champ `icon` de son game.ts).
  ...games.map(
    (g): AppDef => ({
      id: 'game-' + g.id,
      label: g.name,
      title: g.name,
      icon: g.icon || icons.games,
      component: g.component,
      w: g.w ?? 520,
      h: g.h ?? 440,
    }),
  ),
]
