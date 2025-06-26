# Changelog - Market Supervisor

## [1.1.0] - 2024-01-XX

### Ajouté
- **Génération automatique de mots de passe** : Le mot de passe est maintenant optionnel lors de la création d'entreprise
- **Envoi d'emails automatique** : Les identifiants sont envoyés par email lors de la création d'entreprise
- **Service d'email** : Nouveau service pour gérer l'envoi d'emails avec HTML structuré
- **Réinitialisation de mot de passe** : Nouvel endpoint pour réinitialiser le mot de passe d'une entreprise
- **Nouveaux champs entreprise** : Ajout des champs `website` et `telephone` aux entreprises
- **Génération de mots de passe sécurisés** : Utilitaire pour générer des mots de passe complexes

### Modifié
- **DTO CreateCompanyDto** : Le mot de passe est maintenant optionnel
- **Service CompaniesService** : Intégration de la génération automatique de mot de passe et envoi d'email
- **Contrôleur CompaniesController** : Nouvel endpoint `PATCH /companies/:id/reset-password`
- **Configuration SMTP** : Variables d'environnement pour la configuration email

### Supprimé
- **Templates Handlebars** : Remplacement par du HTML inline dans le service d'email

### Configuration requise
- Ajout des variables d'environnement SMTP :
  - `SMTP_HOST`
  - `SMTP_PORT`
  - `SMTP_USERNAME`
  - `SMTP_PASSWORD`
  - `FRONTEND_URL`

### Endpoints API

#### Création d'entreprise
```http
POST /companies
{
  "name": "Tech Solutions Inc.",
  "email": "contact@techsolutions.com",
  "country": "France",
  "sector": "Technology",
  "website": "https://www.techsolutions.com",
  "telephone": "+33612345678"
}
```

#### Réinitialisation de mot de passe
```http
PATCH /companies/:id/reset-password
```

### Sécurité
- Mots de passe générés avec au moins 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial
- Longueur par défaut : 12 caractères
- Hashage avec bcrypt avant stockage
- Gestion d'erreur d'envoi d'email sans interruption de la création d'entreprise 