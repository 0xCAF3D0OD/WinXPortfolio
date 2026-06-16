// Blog (affiché dans MSN Messenger). Ajoute / édite tes articles ici :
// il suffit d'ajouter un objet en haut du tableau `articles`.

export interface Article {
  title: string
  date: string // format libre, ex. '16.06.2026'
  tags?: string[]
  // Corps de l'article : un paragraphe par entrée du tableau.
  body: string[]
}

export const articles: Article[] = [
  {
    title: 'Bienvenue sur mon blog',
    date: '16.06.2026',
    tags: ['intro'],
    body: [
      'Ce portfolio est une recréation de Windows XP. Ce « MSN Messenger » me sert de blog : ' +
        'j’y publie des notes sur le DevOps, le cloud et mes projets.',
      'Pour ajouter un article, j’édite simplement le fichier src/blog.ts.',
    ],
  },
  {
    title: 'alloremplacant.ch en production',
    date: '10.06.2026',
    tags: ['kubernetes', 'gitops'],
    body: [
      'Retour d’expérience sur le déploiement d’alloremplacant.ch : un cluster K3s, ' +
        'du GitOps avec ArgoCD et une chaîne CI/CD GitHub Actions.',
      'Objectif : des déploiements reproductibles et un rollback en un clic.',
    ],
  },
]
