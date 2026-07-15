# Portfolio « Windows XP » — Journal & Crédits

Ce document récapitule les fonctionnalités développées sur le bureau façon Windows XP
(front-end Vue 3 + Vite dans `frontend/`), ainsi que **toutes les sources** utilisées :
dépôts GitHub réutilisés, dépôts consultés en référence, bibliothèques, services et
packs d'icônes.

> Distinction importante ci-dessous :
> **[Réutilisé]** = du code ou des assets ont été intégrés au projet.
> **[Référence]** = seulement consulté pour comprendre la structure / le design, rien
> copié directement.

---

## 1. Fonctionnalités développées

### Bureau & fenêtres
- **Bouton d'aide « ? » façon XP** au-dessus de chaque jeu, ouvrant les règles dans une
  boîte de dialogue XP (barre de titre Luna, vrai bouton de fermeture rouge).
- **Explorer générique navigable** : le Poste de travail et chaque dossier (Projets, C:)
  partagent le même composant récursif (Précédent / Dossier parent, barre d'adresse
  `C:\…`, titre de fenêtre dynamique). Modèle inspiré du système de fichiers de RebornXP.
- **Bloc-notes fonctionnel** : vraie zone de texte + menus déroulants (Sélectionner tout,
  Copier/Couper, Heure/Date, retour à la ligne…), barre d'état `Ln/Col`.
- **Correctif mise en veille** : l'économiseur d'écran ne se déclenche plus pendant qu'on
  joue (les jeux tournent en iframe ; on écoute désormais l'activité à l'intérieur).

### Jeux
- **Solitaire** : suppression du cadre interne redondant, correction du débordement des
  cartes, bouton « New game » remonté dans le bandeau XP.

### Outlook Express (formulaire de contact)
- Refonte fidèle : **vraies icônes Outlook Express** (Envoyer, Couper, Copier, Coller,
  Annuler, Joindre) et **barre de mise en forme fonctionnelle** (police, taille via
  comboboxes XP, gras/italique/souligné, couleur, listes, retrait, alignement, trait),
  **compteur de caractères**.

### Winamp
- **Webamp** intégré, accessible depuis le menu Démarrer (absent du bureau).
- **Sans cadre XP** : le skin Winamp flotte librement (monté directement dans la page,
  déplaçable/redimensionnable partout, zones vides cliquables au travers).
- **Visualiseur Milkdrop** (Butterchurn) activé.

### MSN Messenger (relié à un webhook Discord)
- **Fenêtre principale** : connexion → liste de contacts (identité en ligne, E-mail /
  MSN Aujourd'hui, « Ajouter un contact », barre de recherche, bandeau `.net`).
- **Fenêtre de conversation** : barre d'outils (Inviter / Envoyer des fichiers / Webcam /
  Audio / Activités / Jeux), destinataire, bandeau d'info, images d'affichage (contact en
  haut, expéditeur en bas), barre de format (Police / Émoticône / Clins d'œil / Fonds),
  saisie + boutons Envoyer / Rechercher, onglets Manuscrit / Clavier.
- **Émoticônes MSN authentiques** : 80 bitmaps Microsoft d'origine (convertis en PNG) +
  ~39 raccourcis classiques (`:)`, `(L)`, `(Y)`, `:D`…) rendus en images inline.
- Les messages envoyés sont relayés vers un **salon Discord** (webhook).

### Assistant Clippy
- Animation **fluide** via un **sprite map unique + données Microsoft Agent** (durée
  exacte de chaque frame + branches aléatoires), au lieu d'un PNG par frame → idles
  variés et naturels. On garde nos astuces/actions propres au portfolio.

### Économiseur d'écran
- Remplacé le logo rebondissant par les vrais **« 3D Pipes »** de Windows (recréation
  Three.js), servis en iframe plein écran ; toute activité le ferme.

### Blog (dans « Windows Messenger »)
- Support des **photos** en plus du texte : champ `images` par article, photos déposées
  dans `public/blog/photos/`, affichées en vignettes cliquables (ouverture en grand).

### Exécuter (Run) & easter eggs
- « Exécuter… » ouvre une **vraie fenêtre Run** (reprise du composant Run de
  react-xp) qui ouvre les apps par nom (`cmd`, `notepad`, `winamp`, `sol`…) et les
  URLs, avec des **easter eggs XP** : `bsod` → écran bleu, `format c:` → simulateur
  d'erreurs, `regedit`/`winver`/`matrix`/`coffee`… → messages.

### Propriétés d'affichage (thèmes Luna)
- **Changement de thème** depuis le Panneau de configuration (catégorie « Apparence et
  thèmes » / tuile « Affichage ») ou via `desk.cpl` dans Exécuter : boîte de dialogue
  « Propriétés d'affichage » fidèle (onglets, moniteur d'aperçu, OK/Annuler/Appliquer).
- **Trois jeux de couleurs Luna** — Bleu (par défaut), Vert olive, Argent — plus le choix
  du **papier peint** (Bliss, Windoors, aucun). Démarche reprise de
  **classic-stylesheets** : une base structurelle + des « skins » interchangeables,
  implémentés ici en variables CSS activées par `data-xp-theme` (cf.
  `frontend/src/assets/themes.css`). Choix persisté en localStorage.
- **Aperçus rendus en direct** avec les variables du skin sélectionné : l'onglet
  Apparence empile « Fenêtre inactive / Fenêtre active / Boîte de message » comme le
  vrai XP (react-xp, lui, utilise des PNG statiques) ; l'onglet Bureau affiche le
  papier peint dans un **moniteur CRT**. Moniteur, flèche de combobox (sprite) et
  disposition repris du composant Settings de **react-xp** (`public/xp/display/`) ;
  les comboboxes reprennent le pattern maison d'Outlook Express.

### Assistant de recherche (Rover)
- **Recherche globale** sur tout le portfolio — compétences, projets, articles du blog,
  parcours, applications — dans une fenêtre « Résultats de la recherche » façon Search
  Companion XP : volet gauche avec bulle de question + **Rover animé**, résultats groupés
  à droite, chaque clic ouvrant la fenêtre correspondante (ou le dépôt GitHub).
- **Rover** : planche de sprites « Microsoft Office XP Assistants — Rover » (The Spriters
  Resource), fond vert retiré par chroma-key + despill (`public/xp/rover/`). Sept boucles
  cartographiées à la main (repos, renifle, creuse, lit, content, arrive, repart) jouées
  par la même mécanique que Clippy (background-position + durée par frame). Il renifle
  pendant la recherche, se réjouit s'il trouve, creuse sinon, bouquine quand on l'oublie,
  et se laisse caresser d'un clic.
- Accessible via menu Démarrer → Rechercher, ou `rover` / `search` dans Exécuter.
  Easter egg : chercher « bsod »… ne cliquez pas sur le résultat.

### Options régionales et linguistiques (français / anglais)
- **Changement de langue** du bureau depuis le Panneau de configuration (catégorie
  « Options régionales et linguistiques », après les compétences et l'apparence) ou
  `intl.cpl` / `langue` dans Exécuter : boîte de dialogue fidèle (onglets Options
  régionales / Langues, globe, drapeaux, aperçu des formats de date/heure/nombre,
  OK / Annuler / Appliquer).
- **i18n maison** (pas de bibliothèque) : le français reste la source écrite inline,
  et `tr(fr)` renvoie l'anglais via un dictionnaire par source
  (`frontend/src/desktop/i18n.ts` + `i18n.en.ts`), activé réactivement. Les chaînes
  non traduites (noms propres : Docker, Paint, WordPad…) retombent sur le français.
  Choix persisté en localStorage ; `<html lang>` mis à jour.
- **Phase 1** (ce lot) : écran de connexion, bureau, barre des tâches (« démarrer » →
  « start »), menu Démarrer complet, Panneau de configuration, Propriétés d'affichage,
  Compagnon de recherche, applet régional. **Phase 2** (à venir) : bio WikiDK, articles
  du blog, corps des autres applications (MSN, Outlook, aide, jeux).

### Centre de sécurité & simulateur d'erreurs
- La bulle « Votre ordinateur est peut-être en danger » ouvre le **Centre de sécurité
  Windows** (reproduction fidèle) ; sa pointe est alignée sur l'icône de sécurité.
- Un clic sur **Protection antivirus (INTROUVABLE)** lance le **simulateur d'erreurs XP**
  en plein écran (dessine avec des fenêtres d'erreur), arrêtable via un bouton **Stop**.

---

## 2. Dépôts GitHub utilisés comme modèle ou source

| Projet | Rôle | Ce qu'on en a tiré |
|---|---|---|
| **msnchat-rs** (fourni : `msn-emoticone.zip`) | [Réutilisé] | Les **80 émoticônes MSN authentiques** (bitmaps Microsoft `BITMAP*.bmp`, convertis en PNG → `public/xp/msn/emoticons/`). |
| **modernlivemessenger.com.br** (fourni : `modernlivemessenger.com.br-main.zip`) — clone web MSN (Vite + 7.css) | [Réutilisé] | Les **vraies icônes** de la conversation MSN : barre de format (`change_font`, `select_emoticon`, `select_wink`, `select_background`, `send_nudge`, `editortab`, `arrow`) et barre d'outils (Inviter, Envoyer des fichiers, Webcam, Audio, Activités, Jeux) → `public/xp/msn/chat/`. Structure de la zone d'écriture aussi inspirée de ce dépôt. |
| **react-xp** — <https://github.com/Cyanoxide/react-xp> (fourni : `react-xp-main.zip`) | [Réutilisé] (Clippy, Run) + [Référence] | **Assistant Clippy** : sprite map (`clippy/spritemap.png`) + données Microsoft Agent (`clippyAgent.json`) pour une animation fluide. **Fenêtre « Exécuter »** : structure/logique reprises de son composant Run. **Propriétés d'affichage** : moniteur CRT (`preview_wallpaper.png`), sprite de flèche de combobox et disposition de son composant Settings → `public/xp/display/`. Le reste (composants génériques `XPScrollbars`, `WindowMenu`, `Window`, `Login`) reste une référence pour la suite. |
| **1j01/pipes** — <https://github.com/1j01/pipes> (fourni : `pipes-master.zip`) — recréation Three.js du « 3D Pipes » de Windows | [Réutilisé] | L'**économiseur d'écran** entier (`public/pipes/`), servi en iframe. MIT. |
| **winerror-simulator** — <https://github.com/ganoninc/winerror-simulator> (fourni : `winerror-simulator-master.zip`) — simulateur d'erreurs XP | [Réutilisé] | Le simulateur entier (`public/winerror/`), lancé en plein écran depuis le Centre de sécurité. MIT. |
| **msn-chatbot** (fourni : `msn-chatbot-main.zip`) — backend **Elixir** reliant un vrai client MSN 8.5 (escargot.chat) à ChatGPT | [Référence] | Aucune interface web ; ses captures d'écran ont servi à comprendre la structure de la fenêtre de conversation MSN. |
| **RebornXP / BINX-XPerience** — <https://github.com/Binxy111/BINX-XPerience> | [Référence] | Étudié en amont pour comprendre l'organisation « bureau XP dans le navigateur » (système de fichiers en arbre, Explorer générique, dossiers = My Computer). A inspiré notre Explorer/dossiers, sans copie de code. |
| **classic-stylesheets** — <https://github.com/nielssp/classic-stylesheets> | [Réutilisé] (palettes) + [Référence] (architecture) | Le **système de thèmes** : architecture « base structurelle + skins interchangeables » reprise pour nos jeux de couleurs Luna, et **palettes vert olive / argent** tirées de ses skins `themes/winxp/skins/` (olive-green, silver). MIT. |

---

## 3. Bibliothèques & services externes

| Nom | Usage | Lien / licence |
|---|---|---|
| **Webamp** | Lecteur Winamp (chargé via CDN unpkg `webamp@1.5.0`) | <https://github.com/captbaritone/webamp> — MIT |
| **Butterchurn** + **butterchurn-presets** | Visualiseur Milkdrop de Winamp (CDN unpkg) | <https://github.com/jberg/butterchurn> — MIT |
| **Three.js** | Rendu 3D de l'économiseur « 3D Pipes » (via 1j01/pipes) | <https://threejs.org> — MIT |
| **Web3Forms** | Envoi du formulaire de contact (Outlook Express) par e-mail | <https://web3forms.com> |
| **Webhook Discord** | Relaye les messages MSN du visiteur vers un salon Discord | — |

---

## 4. Jeux intégrés (iframes statiques dans `public/games/`)

| Jeu | Source |
|---|---|
| **Solitaire** | js-solitaire (uzi88) — clone Klondike en JS |
| **Hearts** | Hearts with HTML5 (yjyao) |
| **Pinball** | 3D Pinball Space Cadet (portage web) |
| **Démineur** | implémentation maison (variante « quiz ») |
| **Morpion** | composant Vue maison |

---

## 5. Icônes & assets Windows XP

- Packs d'icônes XP servis depuis `public/xp/` : **WindowsXPIconsSVG**, `winxp-icons`,
  `windowsIcons`, etc. (icônes authentiques shell32 / msgsres).
- Icône Winamp : `public/xp/winxp-icons/winamp.png`.
- Émoticônes MSN : `public/xp/msn/emoticons/` (80 fichiers).
- Icônes de conversation MSN : `public/xp/msn/chat/` (barre de format + toolbar).

---

## 6. Note sur les licences

Les émoticônes MSN, icônes MSN/Windows et sons sont des **assets Microsoft d'origine**,
réutilisés ici dans un cadre **nostalgique / éducatif** (recréation de l'interface
Windows XP). Webamp et Butterchurn sont sous licence **MIT**. Merci aux auteurs des
dépôts cités ci-dessus, qui ont grandement facilité ce travail.
