# 🤖 Guide d'Intégration AWS Bedrock - Agent Supernova

## Vue d'ensemble

Ce guide détaille l'intégration de votre agent AWS Bedrock "Supernova" avec votre application SAPience v3.0 hébergée sur Netlify.

## 🏗️ Architecture

```
Frontend (SAPience) → API Route (/api/bedrock/chat) → AWS Bedrock Agent (Supernova)
```

## 📦 Fichiers ajoutés

### 1. API Backend
- **`app/api/bedrock/chat/route.js`** - Endpoint pour communiquer avec Bedrock
- Gère les requêtes/réponses avec l'agent Supernova
- Support CORS et gestion d'erreurs

### 2. Interface Chat
- **`components/SupernovaChat.jsx`** - Widget de chat flottant
- Interface utilisateur moderne avec design responsive
- Gestion des sessions et historique des messages

### 3. Configuration
- **`package.json`** - Dépendances AWS SDK ajoutées
- **`netlify.toml`** - Variables d'environnement configurées

## ⚙️ Configuration requise

### Variables d'environnement Netlify

Dans votre dashboard Netlify, ajoutez les variables suivantes :

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# Bedrock Agent Configuration  
BEDROCK_AGENT_ID=TIK6SVDXRD
BEDROCK_AGENT_ALIAS_ID=AOGPQ7APV8  # sapnova-prod
```

### IAM Permissions

Votre utilisateur AWS doit avoir les permissions suivantes :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeAgent"
            ],
            "Resource": [
                "arn:aws:bedrock:us-east-1:796973472728:agent/TIK6SVDXRD",
                "arn:aws:bedrock:us-east-1:796973472728:agent-alias/TIK6SVDXRD/AOGPQ7APV8"
            ]
        }
    ]
}
```

## 🚀 Fonctionnalités

### Chat Widget
- **Ouverture/Fermeture** : Bouton flottant en bas à droite
- **Sessions persistantes** : Maintient le contexte de conversation
- **Interface moderne** : Design cohérent avec SAPience
- **Responsive** : S'adapte aux différentes tailles d'écran

### API Features
- **Gestion des sessions** : Utilise l'ID de session Bedrock
- **Error handling** : Gestion robuste des erreurs
- **CORS support** : Compatible avec les appels frontend
- **Streaming response** : Traite les réponses en streaming de Bedrock

## 🔧 Utilisation

### Frontend
```javascript
// Le composant SupernovaChat est déjà intégré dans app/page.jsx
import SupernovaChat from '../components/SupernovaChat';

// Usage dans votre composant
<SupernovaChat />
```

### API
```javascript
// Appel direct à l'API
const response = await fetch('/api/bedrock/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Analysez mes données SAP PUP",
    sessionId: "optional-session-id"
  })
});

const data = await response.json();
```

## 🔍 Test et Débogage

### Vérifier la connexion
1. Visitez `https://sapience-v3.netlify.app`
2. Cliquez sur l'icône de chat en bas à droite
3. Tapez un message de test : "Bonjour Supernova"

### Logs de débogage
- Les erreurs apparaissent dans les logs Netlify Functions
- En mode développement, les traces Bedrock sont incluses
- Vérifiez la console browser pour les erreurs frontend

## 📋 Checklist de déploiement

- [ ] Variables d'environnement AWS configurées dans Netlify
- [ ] Permissions IAM correctement définies
- [ ] Agent Bedrock "Supernova" actif et testé
- [ ] Build et déploiement Netlify réussis
- [ ] Test du chat widget sur la page live

## 🛠️ Résolution de problèmes

### Erreur 500 - Agent non trouvé
- Vérifiez `BEDROCK_AGENT_ID` et `BEDROCK_AGENT_ALIAS_ID`
- Confirmez que l'agent est en statut "PREPARED"

### Erreur d'authentification AWS
- Vérifiez les clés AWS dans les variables d'environnement
- Confirmez les permissions IAM

### Chat ne s'affiche pas
- Vérifiez que `SupernovaChat` est importé dans `page.jsx`
- Inspectez la console pour les erreurs JavaScript

## 🔮 Prochaines étapes

### Améliorations possibles
1. **Intégration SAP directe** - Permettre à Supernova d'accéder aux données SAP
2. **Analytics** - Tracker les conversations et métriques d'usage
3. **Notifications** - Alertes basées sur les insights de Supernova
4. **Multi-langue** - Support français/anglais
5. **Voice chat** - Interface vocale avec Supernova

### Monitoring
- Surveiller les coûts AWS Bedrock
- Analyser les patterns d'utilisation
- Optimiser les performances de l'agent

## 📞 Support

Pour toute question sur cette intégration :
- Consultez la documentation AWS Bedrock
- Vérifiez les logs dans le dashboard Netlify
- Testez l'agent directement dans la console AWS

---

**Agent Supernova** est maintenant intégré à votre plateforme SAPience ! 🚀

Les utilisateurs peuvent maintenant poser des questions sur leurs analyses SAP directement via le chat intelligent.