# Déploiement

L'app vit dans `frontend/` (Vue 3 + Vite + TypeScript). `npm run build` y produit un
dossier `frontend/dist/` 100 % statique, servable n'importe où. Deux options selon ton
infra OpenStack (Infomaniak).

## Build local

```bash
cd frontend
npm install
npm run build        # type-check + build → frontend/dist/
npm run preview      # sert dist/ sur http://localhost:4173
```

## Option A — Stockage objet (Swift) en site statique  *(le plus simple, pas de serveur)*

1. Build (voir ci-dessus), puis crée un conteneur public en mode site web :
   ```bash
   # nécessite python-swiftclient + tes credentials OpenStack sourcés (openrc)
   swift post portfolio --read-acl ".r:*,.rlistings"
   swift post portfolio -m "web-index:index.html" -m "web-error:index.html"
   ```
2. Envoie le build :
   ```bash
   swift upload --object-name "" portfolio frontend/dist/
   ```
3. L'URL publique est de la forme :
   `https://<objectstore-endpoint>/v1/<account>/portfolio/index.html`

> Astuce : mets un CDN / nom de domaine personnalisé devant pour le HTTPS et le cache.

## Option B — Instance + Docker  *(si tu veux ton propre serveur)*

Le `Dockerfile` (à la racine) build `frontend/` puis sert le résultat avec nginx :

```bash
docker build -t kevin-portfolio .
docker run -d -p 80:80 --name portfolio kevin-portfolio
```

Sur OpenStack, complète `INFRA/provider.tf` (credentials), provisionne une petite
instance, ouvre le port 80/443 dans le security group, installe Docker et lance le
conteneur. Mets un reverse proxy (Caddy/Traefik) devant pour le HTTPS automatique via
Let's Encrypt.
