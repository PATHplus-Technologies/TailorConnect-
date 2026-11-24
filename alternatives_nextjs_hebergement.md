# 🔍 Solution : Next.js sur mutualisé ou alternative
peux tu me trouver un hebergeur mitualiser ou me dire que remplacer par next.js pour que cela puisse etre executé par planethoster 
## Analyse de votre projet (bonne nouvelle !)

> [!TIP]
> **Toutes vos pages utilisent `"use client"`** — votre app Next.js n'utilise **aucun SSR** (Server Side Rendering). C'est essentiellement une **SPA (Single Page App)** déguisée en Next.js. Cela change tout !

| Ce que vous utilisez | Ce que vous n'utilisez PAS |
|---|---|
| ✅ `"use client"` partout | ❌ `getServerSideProps` |
| ✅ Axios (appels API côté client) | ❌ Server Components |
| ✅ JWT (auth côté client) | ❌ API Routes Next.js |
| ✅ Routing Next.js | ❌ `getStaticProps` |

---

## Option 1 — Export statique Next.js (Le plus rapide, 0 réécriture)

Puisque vous n'utilisez pas le SSR, Next.js peut générer des **fichiers HTML statiques** que n'importe quel hébergeur peut servir.

### Modification à faire (1 seule ligne)

Dans [`next.config.ts`](file:///c:/Users/USER/Documents/PATH+Technologies/TailorConnect/tailorconnect-frontend/next.config.ts), ajoutez `output: 'export'` :

```diff
 const nextConfig: NextConfig = {
+  output: 'export',
   trailingSlash: true,
-  async rewrites() {      // ← À SUPPRIMER (incompatible avec export statique)
-    return [...]
-  }
 };
```

> [!WARNING]
> Les `rewrites()` sont incompatibles avec l'export statique. Vous devrez appeler l'API Django **directement** avec son URL complète (via la variable d'env `NEXT_PUBLIC_API_URL`).

### Résultat

```bash
npm run build
# → génère un dossier /out/ avec des fichiers HTML/CSS/JS purs
# → Uploadez ce dossier dans public_html/ de PlanetHoster
```

**Limites** : Les routes dynamiques (`/designs/[id]`, `/tailors/[id]`, `/clients/[id]`) nécessiteront une configuration `.htaccess` pour le routing SPA.

---

## Option 2 — Migration vers Vite + React (Recommandée long terme)

Vite est l'équivalent moderne de Create React App. Votre code React existant est **réutilisable à 95%** puisque vous êtes déjà en `"use client"` partout.

### Effort de migration : ~2-4 heures

| Élément | Effort |
|---|---|
| Composants React (`.tsx`) | ✅ Copier-coller direct |
| Routing (`/app/login`, etc.) | 🔄 Remplacer par `react-router-dom` |
| Styles (Tailwind CSS) | ✅ Identique |
| Axios / Contexts | ✅ Identique |
| Variables d'env (`NEXT_PUBLIC_`) | 🔄 Renommer en `VITE_` |

### Déploiement sur PlanetHoster

```bash
npm run build
# → génère /dist/ — fichiers statiques purs
# → Uploadez dans public_html/
```

---

## Option 3 — Hébergeurs mutualisés qui supportent Next.js nativement

Si vous préférez ne rien changer au code :

| Hébergeur | Prix/mois | Node.js | Région | Remarques |
|---|---|---|---|---|
| **Vercel** | 0 € | ✅ Natif | 🌍 Global | Déjà configuré chez vous ✅ |
| **Netlify** | 0 € | ✅ Natif | 🌍 Global | Alternatif à Vercel, très simple |
| **o2switch** | ~7 €/mois | ✅ Via cPanel Node.js App | 🇫🇷 France | Hébergeur français, illimité |
| **Infomaniak** | ~5 €/mois | ✅ Via Node.js App | 🇨🇭 Suisse | Hébergeur suisse francophone |
| **PlanetHoster N World** | ~6 €/mois | ✅ Setup Node.js App | 🇨🇦/🇫🇷 | Votre hébergeur actuel ! (voir ci-dessous) |
| **Hostinger** | ~3 €/mois | ✅ Via cPanel | 🌍 Global | Moins cher mais support moyen |

---

## 🏆 PlanetHoster supporte en fait Node.js !

PlanetHoster **N World** inclut **"Setup Node.js App"** dans cPanel — exactement comme Python. Vous pouvez potentiellement y héberger Next.js.

### Configuration sur PlanetHoster (N World)

```
cPanel → Logiciels → Setup Node.js App
├── Node.js version : 20.x LTS
├── Application root : tailorconnect-frontend
├── Application URL : mondomaine.com
├── Application startup file : server.js
└── Entry point : (auto)
```

```bash
# Via SSH sur PlanetHoster
cd tailorconnect-frontend
npm install
npm run build
# Démarrer avec Next.js standalone ou via Passenger
```

> [!NOTE]
> Vérifiez avec le support PlanetHoster si votre plan (N World Lite ou N World) inclut "Setup Node.js App". Le plan N World standard l'inclut.

---

## Ma recommandation selon votre situation

```
Vous voulez rester sur PlanetHoster mutualisé ?
├── Plan N World → Essayez Node.js App directement
└── Plan Lite    → Option 1 : Export statique Next.js (1 ligne à changer)

Vous acceptez un autre hébergeur gratuit ?
└── Netlify (0€) → Déploiement automatique depuis Git, même expérience que Vercel

Vous voulez migrer proprement ?
└── Option 2 : Vite + React → code réutilisable à 95%, déploiement n'importe où
```

---

## Checklist pour l'export statique (Option 1)

- [ ] Ajouter `output: 'export'` dans `next.config.ts`
- [ ] Supprimer le bloc `rewrites()` de `next.config.ts`
- [ ] Créer `.env.local` avec `NEXT_PUBLIC_API_URL=https://api.mondomaine.com`
- [ ] Remplacer tous les appels `/api/...` par `process.env.NEXT_PUBLIC_API_URL + /api/...`
- [ ] Lancer `npm run build` → dossier `out/` généré
- [ ] Uploader `out/` dans `public_html/` de PlanetHoster
- [ ] Ajouter un `.htaccess` pour le routing SPA (voir ci-dessous)

### Fichier `.htaccess` pour PlanetHoster (routing SPA)

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^ index.html [QSA,L]
```
