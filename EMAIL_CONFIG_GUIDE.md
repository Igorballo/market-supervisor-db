# Guide de Configuration Email - Market Supervisor

## Configuration Simple Gmail

### 1. **Préparer votre compte Gmail**

1. **Activer l'authentification à 2 facteurs** :
   - Allez sur https://myaccount.google.com/
   - Sécurité > Authentification à 2 facteurs
   - Activez-la si ce n'est pas déjà fait

2. **Générer un mot de passe d'application** :
   - Dans les paramètres de sécurité
   - Mots de passe d'application
   - Sélectionnez "Autre (nom personnalisé)"
   - Nommez-le "Market Supervisor"
   - Copiez le mot de passe généré (16 caractères)

### 2. **Configuration dans votre fichier .env**

```env
# Configuration Email Gmail
SMTP_USERNAME=votre-email@gmail.com
SMTP_PASSWORD=votre-mot-de-passe-app-16-caracteres
```

### 3. **Test de la configuration**

#### Test 1 : Vérifier la configuration
```http
POST http://localhost:3000/companies/test-email-config
```

#### Test 2 : Envoyer un email de test
```http
POST http://localhost:3000/companies/test-email
```

### 4. **Exemples de réponses**

#### Configuration valide :
```json
{
  "success": true,
  "message": "Configuration email valide",
  "smtpUsername": "Configuré",
  "smtpPassword": "Configuré"
}
```

#### Configuration invalide :
```json
{
  "success": false,
  "message": "Configuration email invalide",
  "smtpUsername": "Non configuré",
  "smtpPassword": "Non configuré"
}
```

### 5. **Dépannage**

#### Erreur "Invalid login"
- Vérifiez que vous utilisez un **mot de passe d'application** (pas votre mot de passe Gmail normal)
- Le mot de passe d'application fait 16 caractères

#### Erreur "Missing credentials"
- Vérifiez que `SMTP_USERNAME` et `SMTP_PASSWORD` sont définis dans votre `.env`
- Redémarrez l'application après modification du `.env`

#### Erreur "Authentication failed"
- Vérifiez que l'authentification à 2 facteurs est activée
- Régénérez un nouveau mot de passe d'application

### 6. **Mode Fallback**

Si l'email ne peut pas être envoyé, le système :
1. Affiche les identifiants dans les logs de la console
2. Continue la création de l'entreprise
3. Ne fait pas échouer l'opération

### 7. **Logs des identifiants**

Quand l'email échoue, vous verrez dans la console :
```
============================================================
📧 IDENTIFIANTS GÉNÉRÉS (à envoyer manuellement)
============================================================
Email: contact@entreprise.com
Mot de passe: K9m#nP2$qR7vX
============================================================
```

### 8. **Autres fournisseurs**

#### Outlook/Hotmail
```env
SMTP_USERNAME=votre-email@outlook.com
SMTP_PASSWORD=votre-mot-de-passe
```

#### Yahoo
```env
SMTP_USERNAME=votre-email@yahoo.com
SMTP_PASSWORD=votre-mot-de-passe-app
```

### 9. **Sécurité**

- Ne partagez jamais votre mot de passe d'application
- Utilisez des variables d'environnement (pas de hardcoding)
- Régénérez régulièrement vos mots de passe d'application 