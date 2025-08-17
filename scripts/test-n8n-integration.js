#!/usr/bin/env node

/**
 * Script de test pour l'intégration n8n-Netlify
 * Usage: node scripts/test-n8n-integration.js
 */

const axios = require('axios');

const ENDPOINTS = {
  NETLIFY_N8N: 'https://sapience-v3.netlify.app/api/n8n/trigger',
  QUANTUM_OPTIMIZER: 'https://sapience-v3.netlify.app/api/quantum/pup-optimizer',
  DIRECT_N8N: 'https://n8n.sapience.app/webhook/8a17313f-61f4-4845-847a-9ab3a1f8d5b8'
};

const TEST_DATA = {
  sapData: {
    CompanyCode: "1000",
    MaterialNumber: `TEST-${Date.now()}`,
    PUPValue: 125.75,
    StandardPrice: 100.00,
    Quantity: 500,
    Plant: "P001",
    Period: new Date().toISOString().substr(0, 7),
    MovingPrice: 115.25,
    ValuationClass: "3000"
  }
};

async function testEndpoint(name, url, data) {
  console.log(`\n🧪 Testing ${name}...`);
  console.log(`📍 URL: ${url}`);
  
  try {
    const startTime = Date.now();
    
    const response = await axios.post(url, data, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SAPience-Test-Script/1.0'
      },
      timeout: 30000
    });
    
    const duration = Date.now() - startTime;
    
    console.log(`✅ ${name} - SUCCESS (${duration}ms)`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response:`, JSON.stringify(response.data, null, 2));
    
    return { success: true, data: response.data, duration };
    
  } catch (error) {
    console.log(`❌ ${name} - FAILED`);
    console.log(`📄 Error:`, {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      data: error.response?.data
    });
    
    return { success: false, error: error.message };
  }
}

async function runTests() {
  console.log('🚀 SAPience n8n Integration Tests');
  console.log('='*50);
  
  const results = {};
  
  // Test 1: Netlify Edge Function → n8n
  results.netlifyN8N = await testEndpoint(
    'Netlify → n8n Trigger',
    ENDPOINTS.NETLIFY_N8N,
    TEST_DATA
  );
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
  
  // Test 2: Direct n8n Webhook
  results.directN8N = await testEndpoint(
    'Direct n8n Webhook',
    ENDPOINTS.DIRECT_N8N,
    TEST_DATA
  );
  
  await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
  
  // Test 3: Quantum Optimizer (GET)
  console.log(`\n🧪 Testing Quantum Optimizer (GET)...`);
  try {
    const response = await axios.get(ENDPOINTS.QUANTUM_OPTIMIZER, { timeout: 15000 });
    console.log(`✅ Quantum Optimizer - SUCCESS`);
    console.log(`📊 Status: ${response.status}`);
    results.quantumOptimizer = { success: true, data: response.data };
  } catch (error) {
    console.log(`❌ Quantum Optimizer - FAILED`);
    console.log(`📄 Error:`, error.message);
    results.quantumOptimizer = { success: false, error: error.message };
  }
  
  // Summary
  console.log('\n' + '='*50);
  console.log('📊 TEST SUMMARY');
  console.log('='*50);
  
  Object.entries(results).forEach(([test, result]) => {
    const status = result.success ? '✅ PASS' : '❌ FAIL';
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    console.log(`${status} ${test}${duration}`);
  });
  
  const totalPassed = Object.values(results).filter(r => r.success).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`\n🎯 Results: ${totalPassed}/${totalTests} tests passed`);
  
  if (totalPassed === totalTests) {
    console.log('🎉 All tests passed! Integration is working correctly.');
    process.exit(0);
  } else {
    console.log('⚠️  Some tests failed. Check the logs above.');
    process.exit(1);
  }
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
  process.exit(1);
});

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
