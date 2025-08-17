import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime";
import { fromEnv } from "@aws-sdk/credential-providers";

const client = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: fromEnv()
});

export default async function handler(req, res) {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Sapience-Auth');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, sessionId = null, alias = 'sapnova-prod' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Configuration de l'agent Supernova
    const agentId = process.env.BEDROCK_AGENT_ID || 'TIK6SVDXRD';
    const agentAliasId = process.env.BEDROCK_AGENT_ALIAS_ID || 'AOGPQ7APV8'; // sapnova-prod

    const command = new InvokeAgentCommand({
      agentId,
      agentAliasId,
      sessionId: sessionId || `sapience-${Date.now()}`,
      inputText: message,
      enableTrace: false
    });

    console.log('Invoking Bedrock agent:', { agentId, agentAliasId, message });

    const response = await client.send(command);
    
    // Traiter la réponse streaming
    let fullResponse = '';
    let trace = [];

    if (response.completion) {
      for await (const chunk of response.completion) {
        if (chunk.chunk && chunk.chunk.bytes) {
          const text = new TextDecoder().decode(chunk.chunk.bytes);
          fullResponse += text;
        }
        if (chunk.trace) {
          trace.push(chunk.trace);
        }
      }
    }

    const result = {
      response: fullResponse,
      sessionId: response.sessionId,
      timestamp: new Date().toISOString(),
      agentId,
      trace: process.env.NODE_ENV === 'development' ? trace : undefined
    };

    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(200).json(result);

  } catch (error) {
    console.error('Bedrock Agent Error:', error);
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    return res.status(500).json({
      error: 'Failed to communicate with Supernova agent',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}