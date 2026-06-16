import { profile, about, skills, projects, experience } from '../portfolio'
import { themeNames } from './themes'

// Une commande renvoie soit un tableau de lignes HTML, soit { lines, action }.
export type Action = { type: 'theme'; name: string } | { type: 'matrix' } | { type: 'bsod' }
export interface CommandResult {
  lines: string[]
  action?: Action
}
type RunResult = string[] | CommandResult
interface Command {
  desc: string
  hidden?: boolean
  clear?: boolean
  run: (args: string[]) => RunResult
}

// Helpers de mise en forme. Le contenu est statique (le nôtre) — pas d'injection de saisie ici.
const esc = (s: unknown): string =>
  String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c] as string)
const link = (url: string, label?: string): string =>
  `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label || url)}</a>`
const dim = (s: string): string => `<span class="dim">${esc(s)}</span>`
const accent = (s: string): string => `<span class="accent">${esc(s)}</span>`
const ok = (s: string): string => `<span class="ok">${esc(s)}</span>`

function cowsay(message: string): string[] {
  const msg = message || 'Moo!'
  const top = ' ' + '_'.repeat(msg.length + 2)
  const bottom = ' ' + '-'.repeat(msg.length + 2)
  return [
    top,
    `< ${esc(msg)} >`,
    bottom,
    '        \\   ^__^',
    '         \\  (oo)\\_______',
    '            (__)\\       )\\/\\',
    '                ||----w |',
    '                ||     ||',
  ].map((l) => `<span class="banner">${l.startsWith('<') ? l : esc(l)}</span>`)
}

export const banner: string[] = [
  'Windoors XP [Version 5.1.2600]',
  '(C) Copyright 1985-2026 Windoors Corp.',
  '',
  `${accent(profile.name)} ${dim('-')} ${profile.role}`,
  dim(profile.tagline),
  '',
  `Tape ${ok('help')} pour voir les commandes disponibles.`,
  '',
]

const commands: Record<string, Command> = {
  help: {
    desc: 'liste les commandes',
    run: () => [
      'Commandes disponibles :',
      '',
      ...Object.entries(commands)
        .filter(([, c]) => !c.hidden)
        .map(([name, c]) => `  ${accent(name.padEnd(12))} ${dim(c.desc)}`),
      '',
      dim("Astuce : ↑/↓ pour l'historique, Tab pour l'autocomplétion."),
    ],
  },
  whoami: {
    desc: 'qui suis-je',
    run: () => [`${profile.name} — ${profile.role}`, dim(profile.location)],
  },
  about: {
    desc: 'à propos de moi',
    run: () => ['', ...about, ''],
  },
  skills: {
    desc: 'mes compétences techniques',
    run: () => [
      '',
      ...skills.map((s) => `  ${accent(s.group.padEnd(14))} ${s.items.join(', ')}`),
      '',
    ],
  },
  projects: {
    desc: 'mes projets',
    run: () =>
      projects.flatMap((p) => [
        `${accent('› ' + p.name)}  ${dim('[' + p.stack.join(', ') + ']')}`,
        `  ${p.desc}`,
        `  ${link(p.url, p.url)}`,
        '',
      ]),
  },
  experience: {
    desc: 'mon parcours',
    run: () =>
      experience.flatMap((e) => [
        `${accent(e.period)}  ${e.title} ${dim('@ ' + e.company)}`,
        `  ${e.desc}`,
        '',
      ]),
  },
  contact: {
    desc: 'me contacter',
    run: () => [
      '',
      `  email     ${link('mailto:' + profile.email, profile.email)}`,
      `  github    ${link(profile.github)}`,
      `  linkedin  ${link(profile.linkedin)}`,
      '',
    ],
  },
  social: {
    desc: 'mes liens (alias de contact)',
    hidden: true,
    run: () => commands.contact!.run([]),
  },
  ls: {
    desc: 'liste les sections',
    run: () => [
      '<span class="dir">about</span>  <span class="dir">projects</span>  <span class="dir">skills</span>  <span class="dir">experience</span>  <span class="file">contact</span>',
    ],
  },
  banner: { desc: 'affiche la bannière', run: () => banner },
  theme: {
    desc: 'change le thème (theme <nom>)',
    run: (args) => {
      const name = (args[0] || '').toLowerCase()
      if (!name) {
        return {
          lines: [
            'Thèmes disponibles :',
            '  ' + themeNames.map((t) => accent(t)).join('  '),
            dim('Usage : theme dracula'),
          ],
        }
      }
      if (!themeNames.includes(name)) {
        return { lines: [`<span class="err">thème inconnu : ${esc(name)}</span>`] }
      }
      return { lines: [`Thème appliqué : ${accent(name)}`], action: { type: 'theme', name } }
    },
  },
  cowsay: {
    desc: 'fait parler la vache',
    run: (args) => cowsay(args.join(' ')),
  },
  sudo: {
    desc: '???',
    hidden: true,
    run: (args) => {
      if (args.join(' ').includes('rm -rf')) {
        return [`<span class="err">Nice try.</span> ${dim('Cette infra est en lecture seule. 🙃')}`]
      }
      return [
        `<span class="err">${esc(profile.name.split(' ')[0])} n'est pas dans le fichier sudoers.</span> ${dim('Cet incident sera signalé.')}`,
      ]
    },
  },
  matrix: {
    desc: 'wake up, Neo…',
    hidden: true,
    run: () => ({
      lines: [dim('Suis le lapin blanc… (clic ou touche pour sortir)')],
      action: { type: 'matrix' },
    }),
  },
  winver: {
    desc: 'à propos de Windoors',
    run: () => [
      '',
      `${accent('Windoors XP')} ${dim('— Édition Portfolio')}`,
      'Version 5.1 (Build 2600)',
      dim(`Concédé sous licence à : ${profile.name}`),
      '',
    ],
  },
  bsod: {
    desc: '???',
    hidden: true,
    run: () => ({ lines: [dim('Erreur fatale… redémarrage imminent.')], action: { type: 'bsod' } }),
  },
  clear: { desc: "efface l'écran", clear: true, run: () => [] },
}

export const commandNames = Object.keys(commands)

export function execute(input: string): { lines: string[]; action?: Action; clear: boolean } {
  const raw = input.trim()
  if (!raw) return { lines: [], clear: false }
  const parts = raw.split(/\s+/)
  const name = parts[0] ?? ''
  const args = parts.slice(1)
  const cmd = commands[name.toLowerCase()]
  if (!cmd) {
    return {
      lines: [
        `<span class="err">commande introuvable : ${esc(name)}</span>`,
        `Tape ${ok('help')} pour la liste des commandes.`,
      ],
      clear: false,
    }
  }
  const result = cmd.run(args)
  const normalized: CommandResult = Array.isArray(result) ? { lines: result } : result
  return { lines: normalized.lines || [], action: normalized.action, clear: !!cmd.clear }
}
