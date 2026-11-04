# Homeview

Compositeur de dashboards Home Assistant en glisser-déposer, dans l'esprit de
[Bubble Card](https://github.com/Clooos/Bubble-Card).

Homeview ajoute un panneau **Homeview** à la barre latérale : une palette de cartes
à gauche, un canvas sur la grille native de Home Assistant au centre, un inspecteur
à droite. Ce que vous composez est enregistré comme une **vue `sections` Lovelace
standard** — vous pouvez donc rouvrir le dashboard dans l'éditeur natif et
continuer à la main.

## Ce que fait Homeview

| Fonction | Détail |
|---|---|
| Palette | Cartes Bubble Card (`button`, `pop-up`, `media-player`, `climate`, `cover`, `select`, `calendar`, `separator`, `sub-buttons`, `horizontal-buttons-stack`, `empty-column`), cartes natives (`tile`, `heading`, `button`, `markdown`, `history-graph`), et toute autre carte enregistrée dans `window.customCards` |
| Glisser-déposer | Depuis la palette vers une section, entre sections, et réordonnancement à l'intérieur d'une section. Clic sur une entrée de palette = ajout en fin de section |
| Grille | 12 colonnes par section, cellules de 56 px, `grid_options: {columns, rows}` — exactement ce que l'éditeur natif écrit |
| Persistance | `lovelace/config/save` sur un dashboard en mode storage ; création d'un dashboard via `lovelace/dashboards/create` |
| Garde-fous | Un dashboard piloté par une stratégie est refusé (prenez le contrôle d'abord) ; les vues non-`sections` ne sont jamais converties |

## Installation

### Via HACS

1. **HACS** → menu ⋮ → **Dépôts personnalisés**
2. Ajoutez `https://github.com/loran33/Homeview`, catégorie **Intégration**
3. Installez **Homeview**, puis redémarrez Home Assistant
4. **Paramètres** → **Appareils et services** → **Ajouter une intégration** → **Homeview**

Le panneau apparaît dans la barre latérale sous le nom **Homeview**.

> Depuis Home Assistant 2026.11, HACS est remplacé par le **Marketplace** intégré
> (Paramètres → Marketplace), qui accepte les mêmes dépôts personnalisés.

### Manuellement

Copiez `custom_components/homeview/` dans le dossier `custom_components/` de votre
configuration, redémarrez, puis ajoutez l'intégration comme à l'étape 4.

### Bubble Card

Homeview n'exige pas Bubble Card, mais sa palette « Bubble Card » n'apparaît que si
le plugin est installé. Installez-le via HACS/Marketplace en catégorie **Tableau de
bord** : Homeview détecte sa présence dans `window.customCards` et propose alors ses
onze types de cartes.

## Utilisation

1. Ouvrez **Homeview** dans la barre latérale (réservé aux administrateurs)
2. Choisissez un dashboard existant, ou **＋ Nouveau dashboard…**
3. Glissez des cartes depuis la palette ; cliquez une carte pour l'éditer
4. Réglez `Colonnes` (1–12 ou pleine largeur) et `Hauteur` dans l'inspecteur
5. **Enregistrer**

Si le dashboard choisi n'a aucune vue `sections`, Homeview en ajoute une à
l'enregistrement : rien d'existant n'est converti.

## Limites connues

- Le canvas affiche des **aperçus** de cartes (icône, nom, état de l'entité), pas le
  rendu Bubble Card réel : le panneau n'utilise aucune API interne du frontend, ce
  qui le rend insensible aux refontes de Home Assistant. Le rendu final s'obtient en
  ouvrant le dashboard.
- Une seule vue est éditée à la fois : la première vue `sections` du dashboard, ou
  une vue ajoutée si le dashboard n'en a pas.
- Les dashboards en mode YAML et ceux pilotés par une stratégie ne sont pas
  modifiables ici.
- Panneau réservé aux administrateurs (`require_admin=True`), comme les API Lovelace
  qu'il appelle.

## Développement

```bash
cd frontend
npm install
npm run test        # modèle de config + géométrie de drop (26 tests)
npm run typecheck
npm run build       # écrit custom_components/homeview/frontend/homeview-builder.js
```

Le bundle est **commité** : HACS installe le contenu du dépôt tel quel, aucun build
ne s'exécute à l'installation. Rebâtissez avant chaque tag.

```
custom_components/homeview/
├── __init__.py          # enregistre le panneau + sert le bundle (cache_headers=False)
├── config_flow.py       # flow à une étape
├── const.py
├── manifest.json
├── brand/icon.png       # requis par HACS
├── frontend/            # bundle bâti, commité
└── translations/
frontend/src/
├── config.ts            # modèle Lovelace pur, testé
├── geometry.ts          # calcul de l'index d'insertion, testé
├── dnd.ts               # état de drag partagé
├── palette.ts           # construction de la palette depuis window.customCards
├── lovelace.ts          # appels WebSocket
├── hv-canvas.ts         # canvas 12 colonnes
├── hv-inspector.ts      # formulaire de la carte sélectionnée
└── hv-builder.ts        # panneau complet
```

## Licence

MIT — voir [LICENSE](LICENSE).
