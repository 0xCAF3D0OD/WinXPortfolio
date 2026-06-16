# Déploiement

Le site est 100 % statique : `npm run build` produit un dossier `dist/` que tu peux servir
n'importe où. Deux options selon ton infra OpenStack (Infomaniak).

## Option A — Stockage objet (Swift) en site statique  *(le plus simple, pas de serveur)*

1. Build local :
   ```bash
   npm run build
   ```
2. Crée un conteneur public et active le mode site web :
   ```bash
   # nécessite python-swiftclient + tes credentials OpenStack sourcés (openrc)
   swift post portfolio --read-acl ".r:*,.rlistings"
   swift post portfolio -m "web-index:index.html" -m "web-error:index.html"
   ```
3. Envoie le build :
   ```bash
   swift upload --object-name "" portfolio dist/
   ```
4. L'URL publique est de la forme :
   `https://<objectstore-endpoint>/v1/<account>/portfolio/index.html`

> Astuce : mets un CDN / nom de domaine personnalisé devant pour le HTTPS et le cache.

## Option B — Instance + Docker  *(si tu veux ton propre serveur)*

1. Build de l'image (multi-stage, voir `Dockerfile`) :
   ```bash
   docker build -t kevin-portfolio .
   docker run -d -p 80:80 --name portfolio kevin-portfolio
   ```
2. Sur OpenStack, complète `INFRA/provider.tf` (credentials), puis provisionne une
   petite instance, ouvre le port 80/443 dans le security group, installe Docker
   et lance le conteneur. Mets un reverse proxy (Caddy/Traefik) devant pour le HTTPS
   automatique via Let's Encrypt.

## Vérifier le build en local

```bash
npm run build
npm run preview   # sert dist/ sur http://localhost:4173
```
