# Windoors XP — mon portfolio en forme de bureau Windows XP

> Portfolio de **Kevin Di Nocera** (DevOps / Platform Engineer), présenté comme un
> bureau **Windows XP** complet qui tourne dans le navigateur : écran de démarrage,
> session, fenêtres déplaçables, menu Démarrer, Panneau de configuration, jeux,
> économiseur d'écran… et changement de thème Luna.

## La démarche

Plutôt qu'un énième portfolio one-page, j'ai voulu un objet qui raconte quelque chose
de moi : de la nostalgie, du soin du détail, et l'envie de comprendre comment les
choses marchent. Le principe :

- **Le contenu du portfolio est déguisé en applications XP.** Ma bio est un article
  « WikiDK » dans Internet Explorer, mes compétences sont le Panneau de configuration,
  mon CV s'ouvre dans Adobe Reader, le formulaire de contact est Outlook Express, le
  blog vit dans Windows Messenger, et un terminal (`cmd`) répond à de vraies commandes.
- **La fidélité prime.** Chrome des fenêtres Luna, sons système, bulles de
  notification, Clippy animé à partir des données Microsoft Agent, écran bleu,
  `desk.cpl` dans Exécuter… Le but est que quelqu'un qui a connu XP s'y retrouve
  immédiatement.
- **Tout est fait maison sauf quand un projet open source fait mieux** — dans ce cas
  je l'intègre et je le crédite ([CREDITS.md](CREDITS.md) recense tout, en distinguant
  ce qui est réutilisé de ce qui n'a servi que de référence).

## Ce qu'on y trouve

| Application XP | Contenu réel |
|---|---|
| Internet Explorer → WikiDK | Biographie, parcours, certifications |
| Panneau de configuration | Stack technique par catégories + projets associés |
| Panneau de configuration → Affichage | **Changement de thème** (voir ci-dessous) |
| Adobe Reader | CV / dossier de candidature (FR + EN) |
| Outlook Express | Formulaire de contact (Web3Forms) |
| MSN / Windows Messenger | Chat relié à un webhook Discord + blog avec photos |
| Invite de commandes | Terminal interactif (`help`, easter eggs…) |
| Exécuter… | Lance les apps par leur vrai nom (`cmd`, `winmine`, `desk.cpl`…) |
| Démineur, Solitaire, Hearts, Pinball… | Vrais jeux jouables |
| Winamp | Webamp + visualiseur Milkdrop |

## Les thèmes (Propriétés d'affichage)

Le bureau propose les **trois jeux de couleurs Luna** de XP — **Bleu (par défaut)**,
**Vert olive** et **Argent** — plus le choix du papier peint (Bliss, Windoors, aucun),
via une reproduction de la boîte de dialogue « Propriétés d'affichage » (Panneau de
configuration → Apparence et thèmes, ou `desk.cpl` dans Exécuter).

L'implémentation reprend la démarche de
[classic-stylesheets](https://github.com/nielssp/classic-stylesheets) (nielssp, MIT) :
une **base structurelle** (dimensions, dégradés, ombres du chrome XP) séparée de
**skins interchangeables**. Ici les skins sont des jeux de variables CSS
([`frontend/src/assets/themes.css`](frontend/src/assets/themes.css)) activés par un
attribut `data-xp-theme` sur `<html>` ; les palettes olive et argent proviennent des
skins `winxp` de classic-stylesheets. Le choix est persisté en `localStorage`, et le
skin par défaut reprend à l'identique les anciennes valeurs : sans action de
l'utilisateur, rien ne change.

## Architecture

```
frontend/                  Vue 3 + TypeScript + Vite (SPA 100 % statique)
├─ src/desktop/            le « système d'exploitation »
│  ├─ XpDesktop.vue        bureau, barre des tâches, icônes, économiseur, BSOD
│  ├─ XpWindow.vue         fenêtre générique (drag, resize 8 poignées, min/max)
│  ├─ useWindows.ts        gestionnaire de fenêtres (z-order, état, taskbar)
│  ├─ registry.ts          catalogue des applications (id, icône, taille…)
│  ├─ theme.ts             thème + papier peint (persistés, cf. themes.css)
│  ├─ fileTree.ts          arborescence C:\ pour l'Explorer générique
│  └─ apps/                chaque application XP = un composant Vue
├─ src/games/              jeux (composants Vue ou iframes de public/games/)
├─ src/assets/themes.css   skins Luna (variables CSS par data-xp-theme)
├─ src/assets/xp-window.css chrome de fenêtre XP (structure, consomme les variables)
└─ public/                 assets XP (icônes, sons, papiers peints, jeux statiques)
```

Quelques choix techniques :

- **Pas de framework de fenêtrage** : `useWindows.ts` est un composable Vue minimal
  qui gère z-order, minimisation et la barre des tâches.
- **Les apps sont découplées** : elles communiquent par `provide/inject`
  (`openApp`, `showError`, `triggerBsod`…), donc chaque app reste un composant isolé.
- **Les jeux lourds tournent en iframe** (Pinball, Solitaire…) pour isoler leur JS ;
  le bureau surveille l'activité à l'intérieur pour l'économiseur d'écran.
- **Aucun backend** : le site est un build statique ; contact et chat passent par des
  services externes (Web3Forms, webhook Discord).

## Développement

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
npm run type-check   # vue-tsc
npm run lint         # oxlint + eslint
npm run build        # type-check + build → frontend/dist/
```

## Déploiement

`npm run build` produit un dossier `dist/` entièrement statique. Deux options
documentées dans [DEPLOY.md](DEPLOY.md) :

- **Stockage objet OpenStack (Swift)** en mode site statique — pas de serveur ;
- **Docker + nginx** (le [Dockerfile](Dockerfile) à la racine fait le build multi-stage),
  pour une instance auto-hébergée. `INFRA/` contient l'amorce Terraform.

## Crédits & licences

Toutes les sources (dépôts réutilisés, références, packs d'icônes, bibliothèques) sont
détaillées dans [CREDITS.md](CREDITS.md). Les assets Microsoft (icônes, sons,
émoticônes) sont utilisés dans un cadre nostalgique / éducatif ; les bibliothèques
intégrées (Webamp, Butterchurn, Three.js, classic-stylesheets…) sont sous MIT.
