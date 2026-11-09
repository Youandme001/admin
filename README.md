# Glowy — Back-office

Tableau de bord d'administration de la boutique **Glowy** : suivi des commandes (paiement à la livraison), catalogue, stock, catégories et clientes.

API : [Youandme001/backend](https://github.com/Youandme001/backend) · Boutique : [Youandme001/client](https://github.com/Youandme001/client)

## Fonctionnalités

- **Tableau de bord** : chiffre d'affaires, commandes à traiter, commandes du jour, stock faible, CA des 6 derniers mois, meilleures ventes.
- **Commandes** : filtres par statut, recherche (n°, nom, téléphone, ville), panneau de détail, workflow *En attente → Confirmée → Livrée* ou *Rejetée*, bon de livraison imprimable.
- **Produits** : liste avec photos, stock coloré, création et modification avec plusieurs photos.
- **Catégories** et **Clientes** (avec ou sans compte, nombre de commandes, total dépensé).

## Stack

React 18 (Create React App) · CoreUI 4 · Chart.js · React Router 6 (HashRouter) · Axios · Sass

## Structure

```
src/
  api/        client axios (jeton, déconnexion sur 401) + appels par ressource
  context/    AuthContext (session admin vérifiée par /admin/me)
  layout/     AdminLayout (barre latérale + en-tête)
  components/ éléments d'interface partagés (statut, vignette, confirmation…)
  pages/      Login, Dashboard, Orders, Products, ProductForm, Categories, Customers
  utils/      formatage (prix en DT, dates, statuts)
  scss/       thème Glowy sur CoreUI
```

## Démarrage

```bash
npm install
cp .env.example .env     # REACT_APP_API_URL=http://localhost:4000
npm start                # http://localhost:3001
```

Compte de démo (après `npm run seed` dans l'API) : `admin@glowy.tn` / `Admin@2026`.

`npm run build` produit un site statique (`build/`) déployable sur n'importe quel hébergeur.
