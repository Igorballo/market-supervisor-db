# Configuration Email - Market Supervisor

## Vue d'ensemble

Le système génère automatiquement des mots de passe sécurisés lors de la création d'entreprises et les envoie par email. Voici comment configurer l'envoi d'emails.

## Configuration SMTP

### Variables d'environnement requises

Ajoutez ces variables à votre fichier `.env` :

```env
# Configuration SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app
FRONTEND_URL=http://localhost:3000
```

### Configuration Gmail

1. **Activer l'authentification à 2 facteurs** sur votre compte Gmail
2. **Générer un mot de passe d'application** :
   - Allez dans les paramètres de votre compte Google
   - Sécurité > Authentification à 2 facteurs
   - Mots de passe d'application
   - Générez un nouveau mot de passe pour "Market Supervisor"
3. **Utilisez ce mot de passe** dans `SMTP_PASSWORD`

### Autres fournisseurs SMTP

Vous pouvez utiliser d'autres fournisseurs SMTP :

#### Outlook/Hotmail
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
```

#### SendGrid
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
```

#### Amazon SES
```env
SMTP_HOST=email-smtp.eu-west-1.amazonaws.com
SMTP_PORT=587
```

## Fonctionnalités

### Création d'entreprise
- Le mot de passe est **optionnel** lors de la création
- Si non fourni, un mot de passe sécurisé de 12 caractères est généré
- Le mot de passe est envoyé par email à l'adresse de l'entreprise
- L'email contient les identifiants et un lien de connexion

### Réinitialisation de mot de passe
- Endpoint : `PATCH /companies/:id/reset-password`
- Génère un nouveau mot de passe sécurisé
- Envoie le nouveau mot de passe par email

## Templates d'email

Les templates sont situés dans `src/email/templates/` :
- `welcome-company.hbs` : Email de bienvenue avec identifiants
- `password-reset.hbs` : Email de réinitialisation de mot de passe

## Sécurité

- Les mots de passe générés contiennent au moins :
  - 1 lettre minuscule
  - 1 lettre majuscule
  - 1 chiffre
  - 1 caractère spécial
- Longueur par défaut : 12 caractères
- Les mots de passe sont hashés avec bcrypt avant stockage
- Les emails d'erreur sont loggés mais n'interrompent pas la création d'entreprise

## Test de configuration

Pour tester votre configuration email :

1. Configurez les variables d'environnement
2. Créez une entreprise via l'API
3. Vérifiez que l'email est reçu
4. Testez la connexion avec les identifiants reçus

## Dépannage

### Erreurs courantes

1. **"Invalid login"** : Vérifiez `SMTP_USERNAME` et `SMTP_PASSWORD`
2. **"Connection timeout"** : Vérifiez `SMTP_HOST` et `SMTP_PORT`
3. **"Authentication failed"** : Utilisez un mot de passe d'application Gmail

### Logs

Les erreurs d'envoi d'email sont loggées dans la console :
```
Erreur lors de l'envoi de l'email: [détails de l'erreur]
``` 