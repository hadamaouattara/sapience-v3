# SAPience n8n Integration Guide

## 🔗 Workflows Connectés

### 1. Quantum PUP Webhook
- **Webhook ID**: `8a17313f-61f4-4845-847a-9ab3a1f8d5b8`
- **URL**: `https://n8n.sapience.app/webhook/8a17313f-61f4-4845-847a-9ab3a1f8d5b8`
- **Netlify Endpoint**: `https://sapience-v3.netlify.app/api/n8n/trigger`

### 2. Flux de Données

```
SAP Data → Netlify Edge Function → n8n Webhook → Quantum Processing → SAP OData → LangSmith
```

## 📋 Structure des Workflows n8n

### Nodes du Workflow Principal:
1. **Quantum PUP Webhook** - Point d'entrée
2. **Extract SAP Data** - Extraction et validation
3. **Quantum Processing** - Traitement quantique via Netlify
4. **Update SAP OData** - Mise à jour SAP
5. **Send to LangSmith** - Monitoring et tracing
6. **Success Response** - Réponse finale

## 🔧 Configuration des Endpoints

### Edge Functions Netlify:
- **Quantum PUP Optimizer**: `/api/quantum/pup-optimizer`
- **Quantum Monitor**: `/api/quantum/monitor`
- **N8N Trigger**: `/api/n8n/trigger`

### URLs SAP:
- **OData Endpoint**: `http://202.153.35.211:50000/sap/opu/odata/sap/ACM_APPLWC/PUPOptimizationSet`

## 📊 Format des Données SAP

```json
{
  "sapData": {
    "CompanyCode": "1000",
    "MaterialNumber": "MAT-123456",
    "PUPValue": 125.75,
    "StandardPrice": 100.00,
    "Quantity": 500,
    "Plant": "P001",
    "Period": "2025-08",
    "MovingPrice": 115.25,
    "ValuationClass": "3000"
  }
}
```

## 🧪 Tests

### Test manuel avec curl:
```bash
# Test du déclenchement n8n
curl -X POST https://sapience-v3.netlify.app/api/n8n/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "sapData": {
      "CompanyCode": "1000",
      "MaterialNumber": "TEST-001",
      "PUPValue": 125.75,
      "StandardPrice": 100.00,
      "Quantity": 500
    }
  }'

# Test direct du webhook n8n
curl -X POST https://n8n.sapience.app/webhook/8a17313f-61f4-4845-847a-9ab3a1f8d5b8 \
  -H "Content-Type: application/json" \
  -d '{
    "sapData": {
      "CompanyCode": "1000",
      "MaterialNumber": "DIRECT-001",
      "PUPValue": 150.00,
      "StandardPrice": 120.00,
      "Quantity": 300
    }
  }'
```

## 🔍 Monitoring

### LangSmith Tracing:
- **URL**: `https://sapience-v3.netlify.app/api/quantum/monitor?action=trace`
- **Données tracées**: Exécution des workflows, performances, erreurs

### Logs Netlify:
- Accessible via le dashboard Netlify
- Logs en temps réel des edge functions

## 🚀 Déploiement

1. **Auto-déployé** via GitHub → Netlify
2. **Variables d'environnement** configurées dans netlify.toml
3. **Edge functions** activées automatiquement

## 🔒 Sécurité

- **CORS** configuré pour tous les endpoints
- **Headers personnalisés** pour traçabilité
- **Validation** des données SAP avant traitement

## 📈 Performance

- **Edge Functions** pour faible latence
- **Traitement asynchrone** des workflows n8n
- **Monitoring** via LangSmith pour optimisation

## 🆘 Troubleshooting

### Erreurs communes:
1. **Webhook 404**: Vérifier l'URL du webhook n8n
2. **Données SAP invalides**: Vérifier les champs requis
3. **Timeout**: Augmenter les timeouts si nécessaire

### Logs utiles:
- Netlify Function Logs
- n8n Execution Logs
- LangSmith Traces
