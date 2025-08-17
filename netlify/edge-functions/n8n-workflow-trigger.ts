import type { Context, Config } from "@netlify/edge-functions";

// Interface basée sur vos workflows n8n existants
interface N8NWorkflowPayload {
  sapData: {
    CompanyCode: string;
    MaterialNumber: string;
    PUPValue: number;
    StandardPrice: number;
    Quantity: number;
    Plant?: string;
    Period?: string;
    MovingPrice?: number;
    ValuationClass?: string;
  };
  metadata?: {
    source: string;
    timestamp: string;
    requestId: string;
    workflow: string;
  };
}

interface WorkflowResponse {
  success: boolean;
  message: string;
  workflow: string;
  timestamp: string;
  results?: any;
  error?: string;
}

// Configuration des workflows n8n basée sur vos JSON
const N8N_WORKFLOWS = {
  QUANTUM_PUP: {
    webhookId: "8a17313f-61f4-4845-847a-9ab3a1f8d5b8",
    url: "https://n8n.sapience.app/webhook/8a17313f-61f4-4845-847a-9ab3a1f8d5b8",
    name: "sapience-quantum-pup-production",
    description: "Quantum PUP Optimization with SAP OData integration"
  }
};

// URLs des endpoints basées sur votre workflow
const ENDPOINTS = {
  QUANTUM_PROCESSING: "https://sapience-v3.netlify.app/api/quantum/pup-optimizer",
  SAP_ODATA: "http://202.153.35.211:50000/sap/opu/odata/sap/ACM_APPLWC/PUPOptimizationSet",
  LANGSMITH_MONITOR: "https://sapience-v3.netlify.app/api/quantum/monitor?action=trace"
};

// Déclenchement du workflow n8n principal
async function triggerQuantumPUPWorkflow(payload: N8NWorkflowPayload): Promise<WorkflowResponse> {
  const workflow = N8N_WORKFLOWS.QUANTUM_PUP;
  
  try {
    console.log(`🔄 Déclenchement workflow n8n: ${workflow.name}`);
    
    const response = await fetch(workflow.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SAPience-Netlify-v3/1.0',
        'X-Workflow-Source': 'netlify-edge-function',
        'X-Sapience-Version': '3.0'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const result = await response.json();
    
    console.log(`✅ Workflow n8n exécuté avec succès: ${workflow.name}`);
    
    return {
      success: true,
      message: `Workflow ${workflow.name} executed successfully`,
      workflow: workflow.name,
      timestamp: new Date().toISOString(),
      results: result
    };

  } catch (error) {
    console.error(`❌ Erreur workflow n8n ${workflow.name}:`, error);
    
    return {
      success: false,
      message: `Failed to execute workflow ${workflow.name}`,
      workflow: workflow.name,
      timestamp: new Date().toISOString(),
      error: error.message
    };
  }
}

// Validation des données SAP selon votre structure
function validateSAPData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const required = ['CompanyCode', 'MaterialNumber', 'PUPValue', 'StandardPrice', 'Quantity'];
  
  for (const field of required) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  if (data.PUPValue && (isNaN(data.PUPValue) || data.PUPValue <= 0)) {
    errors.push('PUPValue must be a positive number');
  }
  
  if (data.StandardPrice && (isNaN(data.StandardPrice) || data.StandardPrice <= 0)) {
    errors.push('StandardPrice must be a positive number');
  }
  
  if (data.Quantity && (isNaN(data.Quantity) || data.Quantity <= 0)) {
    errors.push('Quantity must be a positive number');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// Edge Function principale pour déclencher les workflows n8n
export default async (request: Request, context: Context): Promise<Response> => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Sapience-Auth',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    // Parse de la requête
    let requestData: any;
    
    if (request.method === 'POST') {
      requestData = await request.json();
    } else {
      // Données de test pour GET
      requestData = {
        sapData: {
          CompanyCode: "1000",
          MaterialNumber: "TEST-" + Date.now(),
          PUPValue: 125.75,
          StandardPrice: 100.00,
          Quantity: 500,
          Plant: "P001",
          Period: new Date().toISOString().substr(0, 7),
          MovingPrice: 115.25,
          ValuationClass: "3000"
        }
      };
    }

    // Extraction et validation des données SAP
    const sapData = requestData.sapData || requestData;
    const validation = validateSAPData(sapData);
    
    if (!validation.valid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid SAP data',
          details: validation.errors,
          timestamp: new Date().toISOString()
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Préparation du payload pour n8n
    const workflowPayload: N8NWorkflowPayload = {
      sapData: {
        CompanyCode: sapData.CompanyCode,
        MaterialNumber: sapData.MaterialNumber,
        PUPValue: parseFloat(sapData.PUPValue),
        StandardPrice: parseFloat(sapData.StandardPrice),
        Quantity: parseInt(sapData.Quantity),
        Plant: sapData.Plant || "P001",
        Period: sapData.Period || new Date().toISOString().substr(0, 7),
        MovingPrice: sapData.MovingPrice ? parseFloat(sapData.MovingPrice) : undefined,
        ValuationClass: sapData.ValuationClass || "3000"
      },
      metadata: {
        source: 'netlify-edge-function',
        timestamp: new Date().toISOString(),
        requestId: context.requestId || crypto.randomUUID(),
        workflow: 'quantum-pup-optimization'
      }
    };

    console.log(`🚀 Démarrage traitement pour matériel: ${workflowPayload.sapData.MaterialNumber}`);

    // Déclenchement du workflow principal
    const workflowResult = await triggerQuantumPUPWorkflow(workflowPayload);

    // Réponse finale
    const response = {
      success: workflowResult.success,
      message: workflowResult.success ? 
        'N8N workflow triggered successfully' : 
        'N8N workflow execution failed',
      data: {
        workflow: workflowResult,
        input: workflowPayload.sapData,
        metadata: workflowPayload.metadata
      },
      endpoints: {
        quantum: ENDPOINTS.QUANTUM_PROCESSING,
        sapOData: ENDPOINTS.SAP_ODATA,
        monitoring: ENDPOINTS.LANGSMITH_MONITOR
      },
      timestamp: new Date().toISOString()
    };

    return new Response(
      JSON.stringify(response, null, 2),
      {
        status: workflowResult.success ? 200 : 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'X-Sapience-Version': '3.0',
          'X-Workflow-Status': workflowResult.success ? 'success' : 'failed',
          'X-Request-ID': workflowPayload.metadata?.requestId
        }
      }
    );

  } catch (error) {
    console.error("❌ Erreur Edge Function n8n:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
};

export const config: Config = {
  path: "/api/n8n/trigger",
};
