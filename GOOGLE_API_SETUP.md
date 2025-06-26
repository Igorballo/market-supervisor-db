# Configuration de l'API Google Custom Search

## 🚨 Problème actuel

L'erreur 403 que vous rencontrez indique que l'API Google Custom Search n'est pas correctement configurée. Voici comment résoudre ce problème :

## 📋 Étapes de configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez la facturation pour votre projet

### 2. Activer l'API Custom Search

1. Dans la console Google Cloud, allez dans "APIs & Services" > "Library"
2. Recherchez "Custom Search API"
3. Cliquez sur "Enable"

### 3. Créer des identifiants API

1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "API Key"
3. Copiez la clé API générée
4. (Optionnel) Restreignez la clé API pour plus de sécurité

### 4. Créer un moteur de recherche personnalisé

1. Allez sur [Google Programmable Search Engine](https://programmablesearchengine.google.com/)
2. Cliquez sur "Create a search engine"
3. Configurez votre moteur de recherche :
   - **Sites to search** : Laissez vide pour rechercher sur tout le web
   - **Name** : Donnez un nom à votre moteur de recherche
4. Cliquez sur "Create"
5. Copiez l'ID du moteur de recherche (Search engine ID)

### 5. Configurer les variables d'environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# Google API Configuration
GOOGLE_API_KEY=votre_clé_api_ici
GOOGLE_CX=votre_search_engine_id_ici
```

## 🧪 Test de la configuration

### 1. Vérifier la configuration

```bash
GET http://localhost:3000/search-results/google-api/check
```

### 2. Test de création de cron

```bash
POST http://localhost:3000/crons
Content-Type: application/json

{
  "name": "Test API Google",
  "description": "Test avec API Google configurée",
  "tags": ["test", "google-api"],
  "keywords": "NestJS development",
  "isActive": true,
  "companyId": "votre_company_id",
  "requestId": "test_google_api_001"
}
```

## 🔧 Mode simulation (sans API Google)

Si vous ne souhaitez pas configurer l'API Google immédiatement, le système fonctionne en mode simulation :

- Les recherches retournent des résultats simulés
- Les crons sont créés normalement
- Les résultats sont sauvegardés en base de données
- Aucune erreur 403 ne sera générée

## 📊 Quotas et limites

- **Gratuit** : 100 requêtes par jour
- **Payant** : $5 pour 1000 requêtes supplémentaires
- **Limite** : 10 000 requêtes par jour maximum

## 🛠️ Dépannage

### Erreur 403 - Forbidden
- Vérifiez que l'API Custom Search est activée
- Vérifiez que votre clé API est valide
- Vérifiez que vous n'avez pas dépassé le quota

### Erreur 400 - Bad Request
- Vérifiez que l'ID du moteur de recherche (CX) est correct
- Vérifiez le format de votre requête

### Aucun résultat
- Vérifiez que votre moteur de recherche est configuré pour rechercher sur le web
- Essayez avec des mots-clés plus génériques

## 🔒 Sécurité

### Restriction de la clé API (recommandé)

1. Dans Google Cloud Console, allez dans "APIs & Services" > "Credentials"
2. Cliquez sur votre clé API
3. Dans "Application restrictions", sélectionnez "HTTP referrers"
4. Ajoutez votre domaine : `http://localhost:3000/*`
5. Dans "API restrictions", sélectionnez "Restrict key"
6. Sélectionnez "Custom Search API"

## 📝 Exemple de configuration complète

```env
# Database Configuration
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=market_supervisor

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Google API Configuration
GOOGLE_API_KEY=AIzaSyC...votre_clé_api_complète
GOOGLE_CX=012345678901234567890:abcdefghijk

# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000
```

## 🎯 Résultat attendu

Après configuration, vous devriez voir dans les logs :

```
🔍 Recherche Google effectuée pour: "NestJS development" - 10 résultats
📊 10 résultats trouvés pour le cron Test API Google
💾 10 résultats sauvegardés pour le cron Test API Google
✅ Recherche automatique terminée pour le cron Test API Google
```

Au lieu de :

```
⚠️ Google API non configurée - Mode simulation activé
🎭 Génération de 5 résultats simulés pour: "NestJS development"
``` 