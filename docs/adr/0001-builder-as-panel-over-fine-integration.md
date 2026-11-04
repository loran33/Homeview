# ADR-0001 — Le builder est un plugin frontend servi par une fine intégration

Date : 2026-11-04
Statut : accepté

## Contexte

Home Assistant n'offre aucune capacité de rendu côté serveur : une intégration est du
Python, sans interface. Le besoin — composer des dashboards en glisser-déposer avec le
vocabulaire visuel de Bubble Card — est donc un problème de frontend.

Trois mécanismes de livraison existent :

1. **Plugin frontend pur** (`hacs.json` + `filename`, comme Bubble Card) : ajoute des
   ressources Lovelace, jamais de panneau dans la barre latérale.
2. **`panel_custom` en YAML** : panneau possible, mais impose d'éditer
   `configuration.yaml` et de redémarrer — un anti-pattern pour une intégration
   moderne, et une installation qui ne correspond plus au parcours HACS.
3. **Intégration custom** (flow à une étape) qui enregistre le panneau
   (`panel_custom.async_register_panel`) et sert le bundle
   (`hass.http.async_register_static_paths`).

Par ailleurs, Bubble Card existe déjà (4 695 ★, douze types de cartes, éditeur par
carte, templates Jinja et JS) et les vues `sections` natives fournissent déjà le
glisser-déposer carte à carte et `grid_options`. Réimplémenter le rendu des cartes
serait une duplication sans valeur ; le manque réel est un éditeur **au niveau
dashboard**, pas carte par carte.

## Décision

L'intégration `homeview` est une fine couche de distribution : elle enregistre un
panneau `homeview-builder`, sert un unique bundle ES module, et ne fait rien d'autre.

Le builder :

- **réutilise Bubble Card** comme rendu, sans dépendance dure : la palette se
  construit depuis `window.customCards`, donc la présence de Bubble Card l'enrichit
  sans le rendre obligatoire ;
- **écrit de la config Lovelace `sections` standard**, pas un format propriétaire —
  un dashboard composé reste éditable dans l'éditeur natif ;
- **ne touche pas aux vues qu'il n'édite pas** : une vue masonry reste masonry, il
  ajoute une vue `sections` plutôt que de convertir ;
- **refuse les dashboards pilotés par une stratégie**, où une écriture serait
  silencieusement sans effet ;
- **sert le bundle avec `cache_headers=False`** : `/local/` est mis en cache 31 jours,
  ce qui figerait les clients sur une ancienne version après une mise à jour.

Le canvas affiche des aperçus auto-rendus et non les cartes Home Assistant réelles :
le panneau ne dépend donc d'aucune API interne du frontend, au prix d'un rendu
approximatif dans l'éditeur.

## Alternatives rejetées

- **Plugin frontend pur** : pas de panneau latéral, donc pas d'espace pour palette +
  canvas + inspecteur ; il faudrait une carte dans une vue, à l'espace contraint.
- **Réimplémenter les cartes Bubble en interne** : duplication d'un projet mature et
  de son écosystème, et perte des templates et conditions qu'il porte déjà.
- **Format de sauvegarde propriétaire** : enfermement et impossibilité de continuer
  l'édition dans Home Assistant.
- **Conversion automatique masonry → sections** : destructeur, et non réversible.

## Conséquences

- Le dépôt doit contenir un bundle bâti : HACS installe le dépôt tel quel, aucun build
  ne s'exécute à l'installation. Le bundle est commité et rebâti avant chaque tag.
- Un backend existe déjà, ce qui laisse la porte ouverte à des services (presets,
  templates de dashboards) sans changer d'architecture.
- Le panneau est réservé aux administrateurs, comme les API Lovelace appelées.
- Une seule vue est éditée à la fois ; l'édition multi-vues est un ajout de l'UI, pas
  un changement de modèle.
