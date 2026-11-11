# Great Bear Shop

## Description

Ce projet est la conception d'un site web de vente en ligne de livres, de vêtements et de jeux vidéo. Ce projet sert de pratique et d'apprentissage dans le développement fullstack.

## Fonctionnalités

### Utilisateur

- se connecter ou se créer un compte afin de passer des commandes
- accès à une page _Compte_
- naviguer l'inventaire des produits en vente
- afficher les détails complets d'un produit
- placer un produit dans le panier
- simuler la vente d'un produit

### Administrateur

- connexion à une page destinée spécifiquement à l'administrateur
  - capacité de modifier l'inventaire (Modifier un produit ou le supprimer)
  - capacité à modifier les données des usagers ou supprimer un utilisateur
- afficher toutes les commandes passées
- modifier le statut d'une commande

## Technologies utilisées

### Langages de programmation

- **TypeScript** : Utilisé pour bénéficier du typage statique, faciliter la détection d'erreurs et améliorer la maintenabilité du code.
- **JavaScript** : Utilisé pour la programmation côté serveur et certaines fonctionnalités côté client.
- **HTML** : Utilisé pour structurer le contenu des pages web.
- **CSS** : Utilisé pour définir la présentation visuelle et la mise en page de l'application.

### Front-end

- **React** : Utilisé pour construire une interface utilisateur dynamique et réactive à l'aide de composants réutilisables. Il facilite également la gestion des différents éléments de l'application, comme le panier et l'affichage des produits.
- **Vite** : Utilisé comme outil de développement et de compilation afin d'accélérer le démarrage du serveur de développement et d'optimiser la génération de l'application.

### Back-end

- **Express.js** : Utilisé pour structurer le serveur et créer les routes API permettant au front-end de communiquer avec le back-end. Il facilite également la gestion des requêtes HTTP et des contrôleurs.

### Base de données et environnement

- **MongoDB (NoSQL)** : Utilisé pour stocker les données de l'application, notamment les utilisateurs, les produits et les commandes. Son modèle documentaire offre une structure flexible qui facilite la gestion de données variées.
- **Docker** : Utilisé pour conteneuriser et uniformiser l'environnement de développement, facilitant ainsi la configuration et l'exécution des différents services du projet.

### Tests et validation

- **Postman** : Utilisé pour tester les routes de l'API, envoyer des requêtes HTTP et vérifier les réponses du serveur indépendamment de l'interface utilisateur.

### Gestion de version

- **Git / GitHub** : Utilisés pour assurer le suivi des modifications du code source, conserver un historique des versions et faciliter la gestion du développement du projet.
