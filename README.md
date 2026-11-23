# Weather Report : la météo dans les transports en commun

**Voir le projet en ligne :** https://tuffet-remi.github.io/weather-report/

Interface conçue pour afficher la météo sur les écrans d'information des stations et des véhicules de transport en commun (format paysage).
Projet réalisé pour la préparation à la journée de sélection du parcours Concepteur Développeur d'Applications (Simplon).

## Fonctionnalités

- Affichage de la météo actuelle de la ville définie dans un fichier de configuration
- Température, description du temps, humidité et vitesse du vent
- Pictogramme adapté aux conditions météo
- Mise à jour automatique des données toutes les heures
- Heure de la dernière mise à jour affichée à l'écran
- Texte et icône de secours si le code météo est inconnu

## Technologies

- HTML, CSS et JavaScript, sans framework
- API [Open-Meteo](https://open-meteo.com/) : géocodage et prévisions météo, gratuite et sans clé d'API

## Structure du projet

```
weather-report/
├── index.html    → structure de la page
├── style.css     → mise en forme
├── meteo.js      → récupération et affichage des données
├── conf.json     → configuration de la ville
├── icons/        → pictogrammes météo
└── fonts/        → police Sansation
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

## Choix techniques

- **Icônes et police hébergées dans le projet** : l'affichage ne dépend pas d'un service externe, ce qui est plus fiable pour des écrans installés dans les transports.
- **Tailles en unités `vh`** : l'interface s'adapte à la taille de l'écran.
- **Fort contraste et grandes polices** : l'écran doit être lisible de loin.
- **Texte alternatif sur les icônes** : pour l'accessibilité.

## Améliorations possibles

- Gérer les erreurs (API indisponible, ville introuvable) avec un message clair
- Réécrire les appels avec `async` / `await` pour un code plus lisible
- Rafraîchir plus souvent, l'API mettant ses données à jour toutes les 15 minutes
- Ralentir la vitesse des animations (voir Docs du site Meteocons)
- Adapter l'affichage à d'autres formats d'écran, comme les écrans verticaux
- Ajouter des tests automatisés et une intégration continue

## Crédits

- Données météo : [Open-Meteo](https://open-meteo.com/), sous licence CC BY 4.0
- Icônes : [Meteocons](https://github.com/basmilius/weather-icons) de Bas Milius, sous licence MIT
- Police : Sansation de Bernd Montag, sous licence SIL Open Font License