# Accessibilité

Cet écran météo est destiné à être affiché dans les stations et les véhicules de transport en commun. Il doit être lisible par le plus grand nombre, de loin et rapidement.

## Nos engagements

- **Contraste élevé** : texte clair sur fond sombre avec un ratio de contraste de 16,3:1 pour le texte principal et de 10,6:1 pour les messages d'erreur, vérifié avec le Contrast Checker de WebAIM. Ces valeurs dépassent le niveau AAA des WCAG (7:1).
- **Grandes polices** : les tailles sont exprimées en unités `vh` et s'adaptent à la hauteur de l'écran pour une lecture à distance.
- **Peu d'informations** : seules les données essentielles sont affichées pour une lecture rapide.
- **Textes alternatifs** : chaque icône porte un attribut `alt`. L'icône météo reprend la description du temps, mise à jour automatiquement.
- **Messages d'erreur clairs** : en cas de problème un message compréhensible s'affiche à l'écran plutôt qu'une page vide.
- **Information doublée** : l'état du ciel est indiqué à la fois par une icône et par un texte.

## Limites connues

- L'animation de l'icône du vent peut gêner les personnes sensibles aux mouvements en cas de tempête. Elle ne tient pas encore compte du réglage « réduire les animations » du système (`prefers-reduced-motion`).
- L'écran ne propose pas de restitution sonore pour les personnes aveugles ou malvoyantes.
- L'interface a été conçue pour des écrans horizontaux. D'autres formats n'ont pas été testés.

## Signaler un problème

Si vous rencontrez un obstacle à l'utilisation de cet écran, vous pouvez ouvrir une issue sur ce dépôt GitHub en décrivant le problème rencontré.