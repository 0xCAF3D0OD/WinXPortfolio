import { profile, about, skills, projects, experience } from './portfolio.js'
import { themeNames } from './themes.js'

// Helpers de mise en forme. Chaque commande renvoie un tableau de lignes HTML.
// Le contenu est statique (le nôtre) — pas d'injection de saisie utilisateur ici.
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))
const link = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label || url)}</a>`
const dim = (s) => `<span class="dim">${esc(s)}</span>`
const accent = (s) => `<span class="accent">${esc(s)}</span>`
const ok = (s) => `<span class="ok">${esc(s)}</span>`

function cowsay(message) {
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

export const banner = [
  '<span class="banner">db   db d88888b db    db d888888b d8b   db</span>',
  '<span class="banner">88  \'8D 88\'     88    88   \'88\'   888o  88</span>',
  '<span class="banner">88ooo88 88ooooo Y8    8P    88    88V8o 88</span>',
  '<span class="banner">88~~~88 88~~~~~ \'8b  d8\'    88    88 V8o88</span>',
  '<span class="banner">88   88 88.      \'8bd8\'    .88.   88  V888</span>',
  '<span class="banner">YP   YP Y88888P    YP    Y888888P VP   V8P</span>',
  '',
  `${accent(profile.name)} ${dim('—')} ${profile.role}`,
  dim(profile.tagline),
  '',
  `Tape ${ok('help')} pour voir les commandes disponibles.`,
  '',
]

const commands = {
  help: {
    desc: 'liste les commandes',
    run: () => [
      'Commandes disponibles :',
      '',
      ...Object.entries(commands)
        .filter(([, c]) => !c.hidden)
        .map(([name, c]) => `  ${accent(name.padEnd(12))} ${dim(c.desc)}`),
      '',
      dim('Astuce : ↑/↓ pour l\'historique, Tab pour l\'autocomplétion.'),
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
  social: { desc: 'mes liens (alias de contact)', hidden: true, run: () => commands.contact.run() },
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
      return [`<span class="err">${esc(profile.name.split(' ')[0])} n'est pas dans le fichier sudoers.</span> ${dim('Cet incident sera signalé.')}`]
    },
  },
  matrix: {
    desc: 'wake up, Neo…',
    hidden: true,
    run: () => ({ lines: [dim('Suis le lapin blanc… (clic ou touche pour sortir)')], action: { type: 'matrix' } }),
  },
  clear: { desc: 'efface l\'écran', clear: true, run: () => [] },
}

export const commandNames = Object.keys(commands)

export function execute(input) {
  const raw = input.trim()
  if (!raw) return { lines: [] }
  const [name, ...args] = raw.split(/\s+/)
  const cmd = commands[name.toLowerCase()]
  if (!cmd) {
    return {
      lines: [
        `<span class="err">commande introuvable : ${esc(name)}</span>`,
        `Tape ${ok('help')} pour la liste des commandes.`,
      ],
    }
  }
  const result = cmd.run(args)
  // run() renvoie soit un tableau de lignes, soit { lines, action }.
  const normalized = Array.isArray(result) ? { lines: result } : result
  return { lines: normalized.lines || [], action: normalized.action, clear: !!cmd.clear }
}
