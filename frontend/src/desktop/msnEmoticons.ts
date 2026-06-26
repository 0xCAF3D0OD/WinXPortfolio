// Émoticônes MSN authentiques (bitmaps Microsoft d'origine, convertis en PNG dans
// public/xp/msn/emoticons/). Chaque entrée associe les raccourcis classiques MSN
// au numéro de bitmap. Identifiées visuellement à partir des images — rien d'inventé.
export interface Emoticon {
  codes: [string, ...string[]] // raccourcis non vides (codes[0] est inséré par le sélecteur)
  n: number // numéro de bitmap → /xp/msn/emoticons/<n>.png
  title: string
}

export const EMOTICONS: Emoticon[] = [
  { codes: [':)', ':-)'], n: 111, title: 'Sourire' },
  { codes: [':(', ':-('], n: 112, title: 'Triste' },
  { codes: [':D', ':-D', ':d'], n: 113, title: 'Rire' },
  { codes: [':P', ':-P', ':p', ':-p'], n: 118, title: 'Tire la langue' },
  { codes: [':O', ':-O', ':o', ':-o'], n: 119, title: 'Surpris' },
  { codes: [';)', ';-)'], n: 130, title: "Clin d'œil" },
  { codes: [':|', ':-|'], n: 162, title: 'Indifférent' },
  { codes: [':@', ':-@'], n: 148, title: 'En colère' },
  { codes: [':S', ':-S', ':s', ':-s'], n: 116, title: 'Confus' },
  { codes: [':$', ':-$'], n: 159, title: 'Gêné' },
  { codes: ['(H)', '(h)', '8-)'], n: 137, title: 'Lunettes de soleil' },
  { codes: ['(Y)', '(y)'], n: 129, title: 'Pouce levé' },
  { codes: ['(N)', '(n)'], n: 128, title: 'Pouce baissé' },
  { codes: ['(L)', '(l)'], n: 126, title: 'Cœur' },
  { codes: ['(U)', '(u)'], n: 115, title: 'Cœur brisé' },
  { codes: ['(K)', '(k)'], n: 124, title: 'Bisou' },
  { codes: ['(F)', '(f)'], n: 123, title: 'Rose' },
  { codes: ['(W)', '(w)'], n: 143, title: 'Rose fanée' },
  { codes: ['(B)', '(b)'], n: 114, title: 'Bière' },
  { codes: ['(D)', '(d)'], n: 120, title: 'Cocktail' },
  { codes: ['(C)', '(c)'], n: 142, title: 'Café' },
  { codes: ['(E)', '(e)'], n: 122, title: 'Enveloppe' },
  { codes: ['(G)', '(g)'], n: 121, title: 'Cadeau' },
  { codes: ['(I)', '(i)'], n: 136, title: 'Ampoule' },
  { codes: ['(T)', '(t)'], n: 131, title: 'Téléphone' },
  { codes: ['(P)', '(p)'], n: 132, title: 'Appareil photo' },
  { codes: ['(*)'], n: 140, title: 'Étoile' },
  { codes: ['(8)'], n: 138, title: 'Note de musique' },
  { codes: ['(S)'], n: 139, title: 'Lune' },
  { codes: ['(#)'], n: 157, title: 'Soleil' },
  { codes: ['(R)', '(r)'], n: 156, title: 'Arc-en-ciel' },
  { codes: ['(@)'], n: 141, title: 'Chat' },
  { codes: ['(&)'], n: 153, title: 'Chien' },
  { codes: ['(6)'], n: 151, title: 'Diablotin' },
  { codes: ['(A)', '(a)'], n: 150, title: 'Ange' },
  { codes: ['(O)', '(o)'], n: 152, title: 'Horloge' },
  { codes: ['(~)'], n: 154, title: 'Film' },
  { codes: ['(Z)', '(z)'], n: 133, title: 'Garçon' },
  { codes: ['(X)', '(x)'], n: 134, title: 'Fille' },
]

export const emoticonUrl = (n: number) => `/xp/msn/emoticons/${n}.png`

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Table raccourci → bitmap + regex (codes longs en premier pour la priorité).
const codeToN = new Map<string, number>()
for (const e of EMOTICONS) for (const c of e.codes) codeToN.set(c, e.n)
const allCodes = [...codeToN.keys()].sort((a, b) => b.length - a.length)
const codeRegex = new RegExp(allCodes.map(escapeRegex).join('|'), 'g')

// Transforme un message texte en HTML sûr, en remplaçant les raccourcis par les images.
export function renderEmoticons(text: string): string {
  return escapeHtml(text).replace(codeRegex, (m) => {
    const n = codeToN.get(m)!
    return n
      ? `<img class="msn-emo" src="${emoticonUrl(n)}" alt="${m}" draggable="false">`
      : m
  })
}
