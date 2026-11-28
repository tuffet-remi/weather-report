# Weather Report : la météo dans les transports en commun
![Tests](https://github.com/tuffet-remi/weather-report/actions/workflows/tests.yml/badge.svg)

**Voir le projet en ligne :** https://tuffet-remi.github.io/weather-report/

Interface conçue pour afficher la météo sur les écrans d'information des stations et des véhicules de transport en commun (format paysage).
Projet réalisé pour la préparation à la journée de sélection du parcours Concepteur Développeur d'Applications (Simplon).

## Fonctionnalités

- Affichage de la météo actuelle de la ville définie dans un fichier de configuration
- Température, description du temps, humidité et vitesse du vent
- Pictogramme adapté aux conditions météo
- Pictogramme adapté au cycle jour/nuit
- Animation du pictogramme dont la vitesse suit la vitesse réelle du vent
- Mise à jour automatique des données toutes les heures
- Heure de la dernière mise à jour affichée à l'écran
- Texte et icône de secours si le code météo est inconnu
- Gestion des erreurs : fichier de configuration illisible ou incomplet, ville introuvable, API indisponible, avec un message clair à l'écran
- Encodage du nom de ville dans l'adresse de l'API

## Technologies

- HTML, CSS et JavaScript, sans framework
- Lottie : animation de l'icône du vent
- Node.js, GitHub Actions et GitHub Pages
- API [Open-Meteo](https://open-meteo.com/) : géocodage et prévisions météo, gratuite et sans clé d'API

## Structure du projet

```
weather-report/
├── index.html           → structure de la page
├── style.css            → mise en forme
├── meteo.js             → récupération et affichage des données
├── weather-utils.js     → fonctions de calcul : traduction des codes météo, vitesse de l'animation
├── conf.json            → configuration de la ville
├── package.json         → configuration du projet et commande de test
├── ACCESSIBILITY.md     → engagements et limites d'accessibilité
├── icons/               → pictogrammes météo
├── fonts/               → police Sansation
├── .github/workflows/   → intégration continue
└── tests/               → tests automatisés
```

## Configuration

La ville affichée se définit dans le fichier `conf.json` :

```json
{ "ville": "Montpellier" }
```

Il suffit de remplacer le nom de la ville pour changer l'affichage. Aucune autre modification n'est nécessaire.

## Lancer le projet

Le plus simple est d'ouvrir la version en ligne : https://tuffet-remi.github.io/weather-report/

Pour travailler sur le code en local, il faut passer par un serveur, car le navigateur bloque la lecture de `conf.json` lorsqu'on ouvre directement `index.html`.
Avec l'extension **Live Server** de VS Code : clic droit sur `index.html` puis « Open with Live Server ».

## Fonctionnement

1. Le script lit le nom de la ville dans `conf.json`.
2. L'API de géocodage d'Open-Meteo convertit ce nom en coordonnées GPS.
3. L'API météo d'Open-Meteo renvoie les données actuelles pour ces coordonnées.
4. Les données sont affichées dans la page, et le code météo (norme OMM) est traduit en texte et en pictogramme.
5. L'opération se répète toutes les heures grâce à `setInterval`.

## Architecture

Le code est découpé en fonctions qui ont chacune un seul rôle :

| Fonction | Rôle |
|---|---|
| `readConfig()` | Lit le fichier `conf.json` et renvoie le nom de la ville |
| `findCoordinates(city)` | Convertit le nom de la ville en coordonnées GPS (API de géocodage) |
| `fetchWeather(latitude, longitude)` | Récupère les données météo et les renvoie dans un format simplifié |
| `displayWeather(city, weather)` | Met à jour l'affichage de la page |
| `displayError(error)` | Affiche un message d'erreur clair à l'écran |
| `updateWeather()` | Enchaîne les étapes et gère les erreurs avec `try … catch` |
| `getWeatherInfo(code, isDay)` | Traduit un code météo en texte et en icône, de jour ou de nuit |
| `computeAnimationSpeed(wind)` | Convertit la vitesse du vent en un multiplicateur pour l'animation |

Les fonctions de récupération des données ne modifient jamais la page, et la fonction d'affichage ne connaît pas le format de l'API. Si l'API changeait de format, seule `fetchWeather` serait à adapter.
`weather-utils.js` contient les fonctions pures et testables, `meteo.js` tout ce qui touche au réseau et à la page.

## Tests réalisés

| Cas testé | Méthode | Résultat attendu | Résultat obtenu |
|---|---|---|---|
| Ville valide | `{ "ville": "Montpellier" }` | Météo affichée, aucun message d'erreur | ✅ Conforme |
| Nom composé et accentué | `{ "ville": "Saint-Étienne" }` | Météo de Saint-Étienne affichée | ✅ Conforme |
| Ville inexistante | `{ "ville": "testabc" }` | Message « Ville introuvable : testabc » | ✅ Conforme |
| Configuration sans ville | `{}` | Message « Aucune ville définie dans le fichier de configuration » | ✅ Conforme |
| Fichier de configuration absent | Renommage de `conf.json` | Message « Impossible de lire le fichier de configuration » | ✅ Conforme |
| Connexion coupée | Mode « Offline » des outils de développement | Message d'erreur affiché à l'écran | ✅ Conforme |
| Retour à la normale | Correction de la configuration | Message d'erreur effacé, météo affichée | ✅ Conforme |

## Tests unitaires

Les fonctions de calcul sont isolées dans `weather-utils.js` et testées automatiquement avec le lanceur de tests intégré à Node.js.

- `getWeatherInfo` : code connu de jour et de nuit, code sans icône de nuit, code inconnu
- `computeAnimationSpeed` : vent nul, vent moyen, vent maximal, vent au-delà du maximum

Lancer les tests en local : `npm test` (Node.js requis).

Les tests s'exécutent aussi automatiquement à chaque push grâce à GitHub Actions.

## Choix techniques

- **Accessibilité** : voir le fichier [ACCESSIBILITY.md](ACCESSIBILITY.md).
- **Icônes et police hébergées dans le projet** : seule la bibliothèque d'animation est chargée depuis un CDN (voir les améliorations possibles).
- **Tailles en unités `vh`** : l'interface s'adapte à la taille de l'écran.
- **Fort contraste et grandes polices** : l'écran doit être lisible de loin.
- **Texte alternatif sur les icônes** : pour l'accessibilité.

## Améliorations possibles

- Conserver les dernières données affichées en cas d'échec d'une mise à jour avec un avertissement
- Rafraîchir plus souvent (l'API mettant ses données à jour toutes les 15 minutes)
- Héberger la bibliothèque Lottie dans le projet ou vérifier son intégrité avec l'attribut `integrity` (SRI)
- Adapter l'affichage à d'autres formats d'écran, comme les écrans verticaux
- Épingler les actions GitHub sur une version figée (identifiant SHA) pour se protéger d'une modification malveillante
- Arrêter l'animation du vent pour les utilisateurs qui ont activé le réglage « réduire les animations » (`prefers-reduced-motion`)

## Crédits

- Données météo : [Open-Meteo](https://open-meteo.com/), sous licence CC BY 4.0
- Icônes : [Meteocons](https://github.com/basmilius/weather-icons) de Bas Milius, sous licence MIT
- Lottie : Bibliothèque lottie-web, sous licence MIT
- Police : Sansation de Bernd Montag, sous licence SIL Open Font License