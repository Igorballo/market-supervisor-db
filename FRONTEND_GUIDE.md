# Guide Frontend - Éviter les doubles soumissions

## Problème
L'API peut recevoir des appels multiples pour la même action (création d'entreprise, etc.) à cause de :
- Double-clic sur le bouton
- Rechargement de page
- Retour en arrière du navigateur
- Formulaires avec soumission multiple

## Solutions côté Frontend

### 1. **Désactiver le bouton après clic**
```javascript
const [isSubmitting, setIsSubmitting] = useState(false);

const handleSubmit = async (data) => {
  if (isSubmitting) return; // Éviter les doubles soumissions
  
  setIsSubmitting(true);
  try {
    await createCompany(data);
    // Succès
  } catch (error) {
    // Gérer l'erreur
  } finally {
    setIsSubmitting(false);
  }
};
```

### 2. **Utiliser un requestId unique**
```javascript
const handleSubmit = async (data) => {
  const requestId = `req_${Date.now()}_${Math.random()}`;
  
  const payload = {
    ...data,
    requestId
  };
  
  await createCompany(payload);
};
```

### 3. **Utiliser un debounce**
```javascript
import { debounce } from 'lodash';

const debouncedSubmit = debounce(async (data) => {
  await createCompany(data);
}, 300);

const handleSubmit = (data) => {
  debouncedSubmit(data);
};
```

### 4. **Gérer les erreurs de conflit**
```javascript
const handleSubmit = async (data) => {
  try {
    await createCompany(data);
  } catch (error) {
    if (error.message.includes('existe déjà')) {
      // Afficher un message d'erreur approprié
      showError('Cette entreprise existe déjà ou est en cours de création');
    } else {
      // Autre erreur
      showError('Erreur lors de la création');
    }
  }
};
```

### 5. **Utiliser un état de chargement global**
```javascript
// Dans votre store/context
const [pendingRequests, setPendingRequests] = useState(new Set());

const addPendingRequest = (requestId) => {
  setPendingRequests(prev => new Set([...prev, requestId]));
};

const removePendingRequest = (requestId) => {
  setPendingRequests(prev => {
    const newSet = new Set(prev);
    newSet.delete(requestId);
    return newSet;
  });
};
```

## Headers recommandés

Ajoutez ces headers à vos requêtes :
```javascript
headers: {
  'X-Request-ID': `req_${Date.now()}_${Math.random()}`,
  'Content-Type': 'application/json'
}
```

## Exemple complet avec React Hook Form

```javascript
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const CompanyForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const requestId = `req_${Date.now()}_${Math.random()}`;
      const payload = { ...data, requestId };
      
      await createCompany(payload);
      // Succès
    } catch (error) {
      if (error.message.includes('existe déjà')) {
        alert('Cette entreprise existe déjà ou est en cours de création');
      } else {
        alert('Erreur lors de la création');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Vos champs de formulaire */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Création en cours...' : 'Créer l\'entreprise'}
      </button>
    </form>
  );
};
```

## Vérification côté Backend

Le backend détecte maintenant automatiquement les doubles soumissions et retourne une erreur appropriée. Vérifiez les logs pour voir les doubles appels détectés. 