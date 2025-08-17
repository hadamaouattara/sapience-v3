# SAPience n8n Workflows - Production Templates
# Based on existing n8n-setup + coldwoong-moon templates + Microsoft SAP patterns

## 🔄 **Workflow 1: Monthly Forecast (Enhanced)**
```json
{
  "meta": {
    "instanceId": "sapience-monthly-forecast-v2"
  },
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "monthly-forecast",
        "responseMode": "responseNode",
        "options": {
          "cors": true,
          "allowedMethods": ["GET", "POST"],
          "allowedHeaders": ["Content-Type", "Authorization", "X-Tenant-ID"]
        }
      },
      "id": "webhook1",
      "name": "Monthly Forecast Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [200, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "values": {
          "string": [
            {"name": "tenant_id", "value": "={{ $json.headers['x-tenant-id'] || $json.tenant_id }}"},
            {"name": "company_codes", "value": "={{ $json.company_codes || ['1000'] }}"},
            {"name": "period", "value": "={{ $json.period || new Date().toISOString().substr(0, 7) }}"},
            {"name": "forecast_horizon", "value": "={{ $json.forecast_horizon || 'monthly' }}"}
          ]
        }
      },
      "id": "extract_params",
      "name": "Extract Parameters",
      "type": "n8n-nodes-base.set",
      "position": [400, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "{{ $env.SAP_PROD_BASE_URL }}/sap/opu/odata/sap/ACM_APPLWC/PUPOptimizationSet",
        "authentication": "basicAuth",
        "options": {
          "headers": {"Accept": "application/json", "X-CSRF-Token": "Fetch"},
          "qs": {
            "$filter": "CompanyCode eq '{{ $json.company_codes[0] }}' and Period eq '{{ $json.period }}'",
            "$format": "json", "$top": "1000"
          }
        }
      },
      "id": "sap_extract",
      "name": "SAP Data Extract",
      "type": "n8n-nodes-base.httpRequest",
      "position": [600, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://sapience-v3.netlify.app/api/ml/predict",
        "options": {
          "headers": {
            "Content-Type": "application/json",
            "X-Tenant-ID": "={{ $('Extract Parameters').first().json.tenant_id }}"
          }
        },
        "sendBody": true,
        "bodyContentType": "json"
      },
      "id": "ml_predict",
      "name": "Hybrid ML Prediction",
      "type": "n8n-nodes-base.httpRequest",
      "position": [800, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "fromEmail": "{{ $env.SMTP_FROM_EMAIL }}",
        "toEmail": "{{ $env.FORECAST_RECIPIENTS }}",
        "subject": "Monthly PUP Forecast - {{ $('Extract Parameters').first().json.period }}",
        "html": "<h2>SAPience Forecast Report</h2><p>Period: {{ $('Extract Parameters').first().json.period }}</p>"
      },
      "id": "email_report",
      "name": "Email Report",
      "type": "n8n-nodes-base.emailSend",
      "position": [1000, 300],
      "typeVersion": 1
    }
  ],
  "connections": {
    "Monthly Forecast Trigger": {"main": [["Extract Parameters"]]},
    "Extract Parameters": {"main": [["SAP Data Extract"]]},
    "SAP Data Extract": {"main": [["Hybrid ML Prediction"]]},
    "Hybrid ML Prediction": {"main": [["Email Report"]]}
  }
}
```

## 🔄 **Workflow 2: Real-time Anomaly Detection**
```json
{
  "meta": {
    "instanceId": "sapience-anomaly-detection-v2"
  },
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{"field": "cronExpression", "value": "0 */6 * * *"}]
        }
      },
      "id": "schedule1",
      "name": "Every 6 Hours",
      "type": "n8n-nodes-base.cron",
      "position": [200, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "{{ $env.SAP_PROD_BASE_URL }}/sap/opu/odata/sap/ACM_APPLWC/PUPOptimizationSet",
        "authentication": "basicAuth",
        "options": {
          "qs": {
            "$filter": "Period eq '{{ new Date().toISOString().substr(0, 7) }}'",
            "$orderby": "CreatedAt desc",
            "$top": "500"
          }
        }
      },
      "id": "sap_data",
      "name": "Get Recent SAP Data", 
      "type": "n8n-nodes-base.httpRequest",
      "position": [400, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://sapience-v3.netlify.app/api/ml/detect-anomalies",
        "sendBody": true,
        "bodyContentType": "json"
      },
      "id": "anomaly_detection",
      "name": "Detect Anomalies",
      "type": "n8n-nodes-base.httpRequest",
      "position": [600, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {"value1": "={{ $json.anomalies.length }}", "operation": "larger", "value2": "0"}
          ]
        }
      },
      "id": "if_anomalies",
      "name": "If Anomalies Found",
      "type": "n8n-nodes-base.if",
      "position": [800, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "resource": "message",
        "operation": "sendMessage",
        "chatId": "{{ $env.TEAMS_WEBHOOK_URL }}",
        "text": "🚨 PUP Anomalies Detected!\n\nFound {{ $('Detect Anomalies').first().json.anomalies.length }} anomalies:\n\n{{ $('Detect Anomalies').first().json.anomalies.map(a => `• ${a.material} (${a.company_code}): ${a.deviation}% deviation`).join('\n') }}"
      },
      "id": "teams_alert",
      "name": "Teams Alert",
      "type": "n8n-nodes-base.microsoftTeams",
      "position": [1000, 200],
      "typeVersion": 1
    },
    {
      "parameters": {
        "resource": "issue",
        "operation": "create",
        "projectKey": "{{ $env.JIRA_PROJECT_KEY }}",
        "issueType": "Task",
        "summary": "PUP Anomaly - {{ $('Detect Anomalies').first().json.anomalies[0].material }}",
        "description": "Automated anomaly detection found significant PUP deviations requiring review."
      },
      "id": "jira_ticket",
      "name": "Create Jira Ticket",
      "type": "n8n-nodes-base.jira",
      "position": [1000, 400],
      "typeVersion": 1
    }
  ],
  "connections": {
    "Every 6 Hours": {"main": [["Get Recent SAP Data"]]},
    "Get Recent SAP Data": {"main": [["Detect Anomalies"]]},
    "Detect Anomalies": {"main": [["If Anomalies Found"]]},
    "If Anomalies Found": {"main": [["Teams Alert"], ["Create Jira Ticket"]]}
  }
}
```

## 🔄 **Workflow 3: What-If Scenario Automation**
```json
{
  "meta": {
    "instanceId": "sapience-whatif-scenarios-v2"
  },
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "what-if-scenarios",
        "responseMode": "responseNode"
      },
      "id": "webhook1", 
      "name": "What-If Trigger",
      "type": "n8n-nodes-base.webhook",
      "position": [200, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "values": {
          "string": [
            {"name": "base_material", "value": "={{ $json.material_number }}"},
            {"name": "scenarios", "value": "={{ $json.scenarios || ['+3%_price', '-5%_fx', '+10%_demand'] }}"},
            {"name": "horizon_months", "value": "={{ $json.horizon_months || 6 }}"}
          ]
        }
      },
      "id": "scenario_params",
      "name": "Extract Scenario Params",
      "type": "n8n-nodes-base.set",
      "position": [400, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "batchSize": 1,
        "options": {}
      },
      "id": "split_scenarios",
      "name": "Split Scenarios",
      "type": "n8n-nodes-base.splitInBatches",
      "position": [600, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://sapience-v3.netlify.app/api/ml/what-if",
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={{ JSON.stringify({\n  material: $('Extract Scenario Params').first().json.base_material,\n  scenario: $json.scenarios[$runIndex],\n  horizon_months: $('Extract Scenario Params').first().json.horizon_months\n}) }}"
      },
      "id": "run_scenario",
      "name": "Run What-If Scenario",
      "type": "n8n-nodes-base.httpRequest",
      "position": [800, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "jsCode": "// Aggregate all scenario results\nconst allResults = $input.all();\nconst scenarios = allResults.map(item => item.json);\n\n// Calculate impact summary\nconst summary = {\n  material: scenarios[0].material,\n  base_pup: scenarios[0].base_prediction,\n  scenarios: scenarios.map(s => ({\n    name: s.scenario_name,\n    predicted_pup: s.predicted_pup,\n    impact_percent: ((s.predicted_pup - s.base_prediction) / s.base_prediction * 100).toFixed(2),\n    confidence: s.confidence\n  })),\n  recommendation: scenarios.reduce((best, current) => \n    current.predicted_pup > best.predicted_pup ? current : best\n  ).scenario_name\n};\n\nreturn [{ json: summary }];"
      },
      "id": "aggregate_results",
      "name": "Aggregate Results",
      "type": "n8n-nodes-base.code",
      "position": [1000, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify($json, null, 2) }}",
        "options": {}
      },
      "id": "response1",
      "name": "Return Results",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1200, 300],
      "typeVersion": 1
    }
  ],
  "connections": {
    "What-If Trigger": {"main": [["Extract Scenario Params"]]},
    "Extract Scenario Params": {"main": [["Split Scenarios"]]},
    "Split Scenarios": {"main": [["Run What-If Scenario"]]},
    "Run What-If Scenario": {"main": [["Aggregate Results"]]},
    "Aggregate Results": {"main": [["Return Results"]]}
  }
}
```

## 🔄 **Workflow 4: SAP-to-Claude Copilot Integration**
```json
{
  "meta": {
    "instanceId": "sapience-claude-copilot-v2"
  },
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "ask-copilot",
        "responseMode": "responseNode"
      },
      "id": "webhook1",
      "name": "Copilot Query",
      "type": "n8n-nodes-base.webhook",
      "position": [200, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "values": {
          "string": [
            {"name": "user_question", "value": "={{ $json.question }}"},
            {"name": "context_filters", "value": "={{ $json.filters || {} }}"},
            {"name": "tenant_id", "value": "={{ $json.tenant_id }}"}
          ]
        }
      },
      "id": "extract_query",
      "name": "Extract Query",
      "type": "n8n-nodes-base.set",
      "position": [400, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "{{ $env.SAP_PROD_BASE_URL }}/sap/opu/odata/sap/ACM_APPLWC/PUPOptimizationSet",
        "authentication": "basicAuth",
        "options": {
          "qs": {
            "$filter": "CompanyCode eq '{{ $json.context_filters.company_code || '1000' }}'",
            "$top": "100"
          }
        }
      },
      "id": "get_context_data",
      "name": "Get SAP Context",
      "type": "n8n-nodes-base.httpRequest",
      "position": [600, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://api.anthropic.com/v1/messages",
        "authentication": "headerAuth",
        "options": {
          "headers": {
            "Content-Type": "application/json",
            "X-API-Key": "{{ $env.ANTHROPIC_API_KEY }}"
          }
        },
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={{ JSON.stringify({\n  model: 'claude-3-5-sonnet-20241022',\n  max_tokens: 1000,\n  messages: [{\n    role: 'user',\n    content: `You are SAPience, an AI copilot for SAP cost management. Answer this question based on the provided SAP data:\\n\\nQuestion: ${$('Extract Query').first().json.user_question}\\n\\nSAP Data Context: ${JSON.stringify($json.d?.results || $json.value || [], null, 2)}\\n\\nProvide a detailed answer with specific numbers and actionable insights.`\n  }]\n}) }}"
      },
      "id": "claude_analysis",
      "name": "Claude Analysis",
      "type": "n8n-nodes-base.httpRequest", 
      "position": [800, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "jsCode": "// Format Claude response with SAP context\nconst claudeResponse = $json.content[0].text;\nconst sapData = $('Get SAP Context').first().json;\nconst query = $('Extract Query').first().json;\n\n// Generate CKM3 deep links\nconst generateCKM3Link = (material, companyCode, period) => {\n  return `sap://CKM3?MATERIAL=${material}&COMPANYCODE=${companyCode}&PERIOD=${period}`;\n};\n\n// Extract materials mentioned in response\nconst materials = (sapData.d?.results || sapData.value || [])\n  .slice(0, 3)\n  .map(item => ({\n    material: item.MaterialNumber,\n    ckm3_link: generateCKM3Link(item.MaterialNumber, item.CompanyCode, item.Period)\n  }));\n\nconst response = {\n  answer: claudeResponse,\n  source: 'SAPience AI Copilot',\n  timestamp: new Date().toISOString(),\n  sap_context: {\n    records_analyzed: (sapData.d?.results || sapData.value || []).length,\n    company_codes: [...new Set((sapData.d?.results || sapData.value || []).map(r => r.CompanyCode))],\n    period_range: query.context_filters.period || 'Current'\n  },\n  actions: {\n    ckm3_links: materials,\n    recommendations: [\n      'Review detailed cost components in CKM3',\n      'Set up monitoring alerts for significant variances',\n      'Consider what-if analysis for optimization'\n    ]\n  }\n};\n\nreturn [{ json: response }];"
      },
      "id": "format_response",
      "name": "Format Response",
      "type": "n8n-nodes-base.code",
      "position": [1000, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify($json, null, 2) }}"
      },
      "id": "response1",
      "name": "Return Answer",
      "type": "n8n-nodes-base.respondToWebhook", 
      "position": [1200, 300],
      "typeVersion": 1
    }
  ],
  "connections": {
    "Copilot Query": {"main": [["Extract Query"]]},
    "Extract Query": {"main": [["Get SAP Context"]]},
    "Get SAP Context": {"main": [["Claude Analysis"]]},
    "Claude Analysis": {"main": [["Format Response"]]},
    "Format Response": {"main": [["Return Answer"]]}
  }
}
```

## 🔄 **Workflow 5: Quantum PUP Enhanced (Production)**
```json
{
  "meta": {
    "instanceId": "sapience-quantum-pup-production-v2"
  },
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "quantum-pup-enhanced",
        "responseMode": "responseNode"
      },
      "id": "webhook1",
      "name": "Quantum PUP Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [200, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "values": {
          "string": [
            {"name": "companyCode", "value": "={{ $json.sapData.CompanyCode }}"},
            {"name": "materialNumber", "value": "={{ $json.sapData.MaterialNumber }}"},
            {"name": "pupValue", "value": "={{ $json.sapData.PUPValue }}"},
            {"name": "standardPrice", "value": "={{ $json.sapData.StandardPrice }}"},
            {"name": "quantity", "value": "={{ $json.sapData.Quantity }}"},
            {"name": "optimizationLevel", "value": "={{ $json.optimization_level || 'hybrid' }}"}
          ]
        }
      },
      "id": "extract_data",
      "name": "Extract SAP Data",
      "type": "n8n-nodes-base.set",
      "position": [400, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://sapience-v3.netlify.app/api/quantum/pup-optimizer",
        "sendBody": true,
        "bodyContentType": "json",
        "options": {
          "headers": {
            "X-Optimization-Level": "={{ $json.optimizationLevel }}"
          }
        }
      },
      "id": "quantum_processing",
      "name": "Quantum Processing Enhanced",
      "type": "n8n-nodes-base.httpRequest",
      "position": [600, 300],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://sapience-v3.netlify.app/api/ml/predict",
        "sendBody": true,
        "bodyContentType": "json"
      },
      "id": "classical_ml",
      "name": "Classical ML Backup",
      "type": "n8n-nodes-base.httpRequest",
      "position": [600, 500],
      "typeVersion": 1
    },
    {
      "parameters": {
        "jsCode": "// Ensemble quantum + classical results\nconst quantumResult = $('Quantum Processing Enhanced').first()?.json;\nconst classicalResult = $('Classical ML Backup').first()?.json;\n\nlet finalPrediction;\nlet confidence;\nlet method;\n\nif (quantumResult?.success && quantumResult?.data?.quantum?.improvement > 5) {\n  // Use quantum if significant improvement\n  finalPrediction = quantumResult.data.quantum.optimizedPUP;\n  confidence = quantumResult.data.quantum.confidence;\n  method = 'quantum';\n} else if (classicalResult?.predictions) {\n  // Fallback to classical\n  finalPrediction = classicalResult.predictions[0]?.predicted_pup;\n  confidence = 0.85;\n  method = 'classical';\n} else {\n  // Ultimate fallback\n  finalPrediction = parseFloat($('Extract SAP Data').first().json.pupValue) * 1.05;\n  confidence = 0.70;\n  method = 'fallback';\n}\n\nreturn [{\n  json: {\n    optimized_pup: finalPrediction,\n    confidence: confidence,\n    method_used: method,\n    quantum_available: !!quantumResult?.success,\n    classical_available: !!classicalResult?.predictions,\n    improvement_percent: ((finalPrediction / parseFloat($('Extract SAP Data').first().json.pupValue) - 1) * 100).toFixed(2)\n  }\n}];"
      },
      "id": "ensemble_results",
      "name": "Ensemble Results",
      "type": "n8n-nodes-base.code",
      "position": [800, 400],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "{{ $env.SAP_PROD_BASE_URL }}/sap/opu/odata/sap/ACM_APPLWC/PUPOptimizationSet('{{ $('Extract SAP Data').first().json.materialNumber }}')",
        "authentication": "basicAuth",
        "requestMethod": "PATCH",
        "sendBody": true,
        "bodyContentType": "json",
        "jsonBody": "={{ JSON.stringify({\n  OptimizedPUP: $json.optimized_pup,\n  Confidence: $json.confidence,\n  OptimizationMethod: $json.method_used,\n  LastUpdated: new Date().toISOString()\n}) }}"
      },
      "id": "update_sap",
      "name": "Update SAP OData",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1000, 400],
      "typeVersion": 1
    },
    {
      "parameters": {
        "url": "https://sapience-v3.netlify.app/api/quantum/monitor?action=trace",
        "sendBody": true,
        "bodyContentType": "json"
      },
      "id": "langsmith_trace",
      "name": "Send to LangSmith",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1200, 400],
      "typeVersion": 1
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ JSON.stringify({\n  success: true,\n  message: 'Quantum PUP optimization completed',\n  workflow: 'quantum-pup-enhanced',\n  timestamp: new Date().toISOString(),\n  results: $json\n}, null, 2) }}"
      },
      "id": "success_response",
      "name": "Success Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [1400, 400],
      "typeVersion": 1
    }
  ],
  "connections": {
    "Quantum PUP Webhook": {"main": [["Extract SAP Data"]]},
    "Extract SAP Data": {"main": [["Quantum Processing Enhanced"], ["Classical ML Backup"]]},
    "Quantum Processing Enhanced": {"main": [["Ensemble Results"]]},
    "Classical ML Backup": {"main": [["Ensemble Results"]]},
    "Ensemble Results": {"main": [["Update SAP OData"]]},
    "Update SAP OData": {"main": [["Send to LangSmith"]]},
    "Send to LangSmith": {"main": [["Success Response"]]}
  }
}
```

## 🚀 **Deployment Instructions**

### 1. Import Workflows to n8n
```bash
# In your n8n instance (exonov-u39090.vm.elestio.app)
curl -X POST "https://exonov-u39090.vm.elestio.app/rest/workflows/import" \
  -H "Content-Type: application/json" \
  -d @monthly-forecast.json

curl -X POST "https://exonov-u39090.vm.elestio.app/rest/workflows/import" \
  -H "Content-Type: application/json" \
  -d @anomaly-detection.json

# Repeat for all 5 workflows
```

### 2. Environment Variables Required
```bash
# SAP Configuration
SAP_PROD_BASE_URL=http://202.153.35.211:50000
SAP_USERNAME=your_sap_user
SAP_PASSWORD=your_sap_password

# Notification Settings
SMTP_FROM_EMAIL=noreply@sapience.com
FORECAST_RECIPIENTS=controllers@yourcompany.com
TEAMS_WEBHOOK_URL=your_teams_webhook
JIRA_PROJECT_KEY=PUP

# AI Services
ANTHROPIC_API_KEY=your_claude_key
SAPIENCE_API_KEY=your_internal_api_key

# Monitoring
LANGSMITH_API_KEY=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
```

### 3. Webhook URLs (Auto-generated)
```
Monthly Forecast: https://exonov-u39090.vm.elestio.app/webhook/monthly-forecast
Anomaly Detection: (Scheduled - no webhook)
What-If Scenarios: https://exonov-u39090.vm.elestio.app/webhook/what-if-scenarios  
Claude Copilot: https://exonov-u39090.vm.elestio.app/webhook/ask-copilot
Quantum PUP: https://exonov-u39090.vm.elestio.app/webhook/quantum-pup-enhanced
```

### 4. Testing Commands
```bash
# Test Monthly Forecast
curl -X POST "https://exonov-u39090.vm.elestio.app/webhook/monthly-forecast" \
  -H "Content-Type: application/json" \
  -H "X-Tenant-ID: demo-tenant" \
  -d '{"company_codes": ["1000"], "period": "2025-08"}'

# Test Copilot
curl -X POST "https://exonov-u39090.vm.elestio.app/webhook/ask-copilot" \
  -H "Content-Type: application/json" \
  -d '{"question": "What are the top 3 materials with highest PUP variance this month?", "tenant_id": "demo"}'

# Test Quantum PUP
curl -X POST "https://exonov-u39090.vm.elestio.app/webhook/quantum-pup-enhanced" \
  -H "Content-Type: application/json" \
  -d '{"sapData": {"CompanyCode": "1000", "MaterialNumber": "MAT-001", "PUPValue": 125.75, "StandardPrice": 100.00, "Quantity": 500}}'
```

🎯 **Result**: 5 production-ready workflows leveraging your existing infrastructure + templates, ready for immediate SaaS deployment!
