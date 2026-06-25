<script setup lang="ts">
import { ref, computed } from 'vue'

// Centre d'aide et de support façon Windows XP.
// Page d'accueil reproduisant l'interface réelle (rubriques + icônes), et page
// liée « Assistance à distance » dont le contenu vient de la documentation
// fournie (csgnetwork.com/rdcsupport.html), reformulé et sourcé.
type View = 'home' | 'remote'
const view = ref<View>('home')

const ico = (name: string) => `/xp/windowsIcons/${name}`

const helpTopics = [
  { label: 'Nouveautés de Windows XP', icon: ico('windows.png') },
  { label: 'Musique, vidéo, jeux et photos', icon: ico('846(16x16).png') },
  { label: 'Réseau et Web', icon: ico('404(16x16).png') },
  { label: 'Travailler à distance', icon: ico('rdp.png') },
  { label: 'Personnaliser votre ordinateur', icon: ico('300(16x16).png') },
  { label: 'Accessibilité', icon: ico('238(16x16).png') },
  { label: 'Impression et télécopie', icon: ico('printer(32x32).png') },
  { label: 'Résolution d\'un problème', icon: ico('214(16x16).png') },
]

const askAssistance = [
  {
    label: 'Inviter un ami à se connecter à votre ordinateur avec l\'Assistance à distance',
    icon: ico('357(16x16).png'),
    go: 'remote' as View,
  },
  { label: 'Obtenir de l\'aide de Microsoft', icon: ico('747(16x16).png'), go: null },
]

const pickTask = [
  { label: 'Maintenir votre ordinateur à jour avec Windows Update', icon: ico('322(16x16).png') },
  {
    label: 'Rechercher du matériel et des logiciels compatibles avec Windows XP',
    icon: ico('392(16x16).png'),
  },
  {
    label: 'Annuler des modifications avec la Restauration du système',
    icon: ico('restore.ico'),
  },
  {
    label: 'Utiliser des outils pour afficher les informations de votre ordinateur',
    icon: ico('505(16x16).png'),
  },
]

// Recherche (loupe) : filtre les rubriques, l'assistance et les tâches.
const query = ref('')
const has = (label: string) => label.toLowerCase().includes(query.value.trim().toLowerCase())
const fTopics = computed(() => helpTopics.filter((t) => has(t.label)))
const fAsk = computed(() => askAssistance.filter((a) => has(a.label)))
const fTask = computed(() => pickTask.filter((t) => has(t.label)))
const searching = computed(() => query.value.trim().length > 0)
const noResults = computed(
  () => searching.value && !fTopics.value.length && !fAsk.value.length && !fTask.value.length,
)
function onSearch() {
  if (searching.value) view.value = 'home'
}

const steps = [
  'Cliquez sur Démarrer, puis sur Aide et support.',
  'Dans le Centre d\'aide et de support, sous « Demander de l\'assistance », cliquez sur « Inviter un ami à se connecter à votre ordinateur avec l\'Assistance à distance ».',
  'Cliquez sur « Inviter une personne à vous aider ».',
  'Choisissez un contact Windows Messenger ou saisissez une adresse e-mail, puis cliquez sur « Inviter cette personne ». Par e-mail, vous indiquerez un objet, un message et un mot de passe.',
  'Avec Windows Messenger, l\'invitation est envoyée par message instantané : la personne ouvre la fenêtre et clique sur « Accepter ». Par e-mail, elle ouvre la pièce jointe.',
  'Si l\'expert est invité à se connecter à votre ordinateur, il clique sur « Oui ».',
  'Lorsque l\'on vous demande l\'autorisation de partager votre écran, cliquez sur « Oui ».',
  'Si le réseau est correctement configuré, la fenêtre d\'Assistance à distance s\'ouvre. Vous pouvez y échanger des messages, comme en messagerie instantanée. Si elle n\'apparaît pas, votre réseau ne prend pas en charge l\'Assistance à distance.',
  'Sur l\'ordinateur de l\'expert, une grande fenêtre affiche votre Bureau. Tout ce que vous faites s\'y reflète. Pour prendre la main, il clique sur « Prendre le contrôle ».',
  'Sur votre ordinateur, l\'Assistance à distance vous demande d\'autoriser l\'expert à prendre le contrôle : cliquez sur « Oui ».',
  'L\'expert clique sur « OK » sur son ordinateur.',
  'Vous partagez alors le contrôle de votre ordinateur : vous montrez le problème, l\'expert vous guide pour le résoudre. Pour mettre fin au contrôle, appuyez sur Échap ou cliquez sur « Arrêter le contrôle ».',
  'L\'expert confirme par « OK » qu\'il ne fait plus que voir votre écran. Chacun peut alors fermer sa fenêtre d\'Assistance à distance.',
]
</script>

<template>
  <div class="help">
    <!-- Bandeau d'en-tête -->
    <header class="help-header">
      <div class="help-title">
        <img src="/xp/start/help.png" alt="" />
        <span>Centre d'aide et de support</span>
      </div>
      <div class="help-search">
        <input v-model="query" type="text" placeholder="Rechercher" @input="onSearch" />
        <button @click="onSearch">Démarrer la recherche</button>
      </div>
    </header>

    <!-- Barre de navigation -->
    <nav class="help-nav">
      <span class="nav-btn" :class="{ disabled: view === 'home' }" @click="view = 'home'">
        ◄ Précédent
      </span>
      <span class="nav-btn disabled">Suivant ►</span>
      <span class="nav-sep"></span>
      <span class="nav-btn" @click="view = 'home'">Accueil</span>
      <span class="nav-btn inert">Index</span>
      <span class="nav-btn inert">Favoris</span>
      <span class="nav-btn inert">Historique</span>
      <span class="nav-btn inert">Support</span>
      <span class="nav-btn inert">Options</span>
    </nav>

    <!-- ACCUEIL -->
    <div v-if="view === 'home'" class="help-home">
      <div class="col col-left">
        <section v-if="fTopics.length" class="card">
          <h2 class="card-title">Choisir une rubrique d'aide</h2>
          <ul class="topics">
            <li v-for="t in fTopics" :key="t.label" class="topic unavailable">
              <img :src="t.icon" alt="" />
              <a>{{ t.label }}</a>
            </li>
          </ul>
        </section>
      </div>

      <div class="col col-right">
        <section v-if="fAsk.length" class="card">
          <h2 class="card-title">Demander de l'assistance</h2>
          <ul class="links">
            <li v-for="a in fAsk" :key="a.label" class="link" :class="{ unavailable: !a.go }">
              <img :src="a.icon" alt="" />
              <a :class="{ clickable: a.go }" @click="a.go && (view = a.go)">{{ a.label }}</a>
            </li>
          </ul>
        </section>

        <section v-if="fTask.length" class="card">
          <h2 class="card-title">Choisir une tâche</h2>
          <ul class="links">
            <li v-for="t in fTask" :key="t.label" class="link unavailable">
              <img :src="t.icon" alt="" />
              <a>{{ t.label }}</a>
            </li>
          </ul>
        </section>

        <section v-if="!searching" class="card didyouknow">
          <h2 class="card-title">Le saviez-vous ?</h2>
          <p>
            Connectez-vous à Internet pour recevoir les dernières actualités et mises à jour dans
            le Centre d'aide et de support.
          </p>
        </section>

        <p v-if="noResults" class="help-noresult">
          Aucune rubrique d'aide ne correspond à « {{ query }} ».
        </p>
      </div>
    </div>

    <!-- PAGE : ASSISTANCE À DISTANCE -->
    <div v-else class="help-article">
      <p class="crumbs">
        <a @click="view = 'home'">Centre d'aide et de support</a>
        <span> › Demander de l'assistance</span>
      </p>
      <h1>Obtenir de l'aide avec l'Assistance à distance</h1>
      <p>
        Lorsqu'un problème survient sur votre ordinateur, il peut être difficile d'expliquer ce qui
        se passe et de le résoudre au téléphone avec un ami ou un technicien. Windows XP propose
        pour cela l'<b>Assistance à distance</b> : vous pouvez inviter un ami ou un technicien à
        voir votre Bureau et, si nécessaire, à prendre temporairement le contrôle de votre clavier
        et de votre souris via Internet. Vous voyez tout ce qu'il fait, ce qui vous permet aussi
        d'apprendre comment résoudre le problème.
      </p>
      <h2>Pour utiliser l'Assistance à distance</h2>
      <ol class="steps">
        <li v-for="(s, i) in steps" :key="i">{{ s }}</li>
      </ol>
      <p class="note">
        L'Assistance à distance est un moyen rapide d'obtenir de l'aide à distance — et aussi de
        montrer quelque chose à quelqu'un, comme un diaporama de photos ou un nouveau programme.
      </p>
      <p class="source">
        Source :
        <a href="http://www.csgnetwork.com/rdcsupport.html" target="_blank" rel="noreferrer">
          XP Remote Desktop Connection Support — csgnetwork.com
        </a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.help {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: Tahoma, 'Noto Sans', sans-serif;
  font-size: 12px;
  color: #111;
}

/* En-tête */
.help-header {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 6px 12px;
  color: #fff;
  background: linear-gradient(180deg, #3f8de8 0%, #1f5fce 55%, #16469f 100%);
  border-bottom: 2px solid #0a347d;
}
.help-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
}
.help-title img {
  width: 24px;
  height: 24px;
}
.help-search {
  display: flex;
  align-items: center;
  gap: 4px;
}
.help-search input {
  width: 130px;
  font-size: 12px;
  padding: 2px 4px;
}
.help-search button {
  font-size: 11px;
  padding: 2px 6px;
}

/* Barre de navigation */
.help-nav {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px 10px;
  background: linear-gradient(180deg, #f6f5ee 0%, #e6e3d8 100%);
  border-bottom: 1px solid #b7b5ad;
  font-size: 12px;
}
.nav-btn {
  padding: 2px 8px;
  border: 1px solid transparent;
  border-radius: 3px;
  color: #16469f;
  cursor: pointer;
}
.nav-btn:hover {
  border-color: rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.6);
}
.nav-btn.disabled {
  color: #999;
  cursor: default;
}
.nav-btn.disabled:hover {
  border-color: transparent;
  background: transparent;
}
/* Onglet de nav inerte : visible et cliquable, mais grisé (sans effet) */
.nav-btn.inert {
  color: #9a9a9a;
}
.nav-sep {
  width: 1px;
  height: 16px;
  background: #b7b5ad;
  margin: 0 4px;
}

/* Accueil deux colonnes */
.help-home {
  flex: 1;
  min-height: 0;
  display: flex;
  gap: 12px;
  padding: 12px;
  overflow: auto;
  background: linear-gradient(180deg, #eef3fb 0%, #dfe8f6 100%);
}
.col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.col-left {
  width: 46%;
}
.col-right {
  flex: 1;
}
.card {
  background: #fff;
  border: 1px solid #b9c8e3;
  border-radius: 4px;
  overflow: hidden;
}
.card-title {
  margin: 0;
  padding: 5px 10px;
  font-size: 13px;
  color: #fff;
  background: linear-gradient(180deg, #5b86d6 0%, #3f6cc4 100%);
}
.topics,
.links {
  list-style: none;
  margin: 0;
  padding: 8px 10px;
}
.topic,
.link {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 4px 0;
}
.topic img,
.link img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
  margin-top: 1px;
}
.topic a,
.link a {
  color: #16469f;
  cursor: pointer;
}
.topic a:hover,
.link a.clickable:hover {
  text-decoration: underline;
  color: #d35400;
}
.link a:not(.clickable) {
  cursor: default;
}
/* Rubriques/tâches non disponibles : légèrement grisées */
.topic.unavailable a,
.link.unavailable a {
  color: #9a9a9a;
  cursor: default;
}
.topic.unavailable a:hover,
.link.unavailable a:hover {
  color: #9a9a9a;
  text-decoration: none;
}
.topic.unavailable img,
.link.unavailable img {
  opacity: 0.45;
}
.didyouknow p {
  margin: 0;
  padding: 8px 10px;
  line-height: 1.5;
  color: #333;
}
.help-noresult {
  margin: 4px 0;
  font-size: 12px;
  color: #16469f;
}

/* Page article */
.help-article {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px 22px;
}
.crumbs {
  margin: 0 0 10px;
  font-size: 11px;
  color: #666;
}
.crumbs a {
  color: #16469f;
  cursor: pointer;
}
.crumbs a:hover {
  text-decoration: underline;
}
.help-article h1 {
  font-size: 17px;
  color: #16469f;
  margin: 0 0 10px;
}
.help-article h2 {
  font-size: 14px;
  color: #16469f;
  margin: 16px 0 8px;
}
.help-article p {
  line-height: 1.5;
  margin: 0 0 10px;
}
.steps {
  margin: 0 0 12px;
  padding-left: 22px;
}
.steps li {
  line-height: 1.5;
  margin-bottom: 7px;
}
.note {
  background: #fffbe6;
  border: 1px solid #e3d8a0;
  border-radius: 3px;
  padding: 8px 10px;
}
.source {
  margin-top: 14px;
  font-size: 11px;
  color: #666;
  border-top: 1px solid #ddd;
  padding-top: 8px;
}
.source a {
  color: #16469f;
}
</style>
