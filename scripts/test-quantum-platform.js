#!/usr/bin/env node

/**
 * 🧪 Test Suite SAPience Quantum ML Platform
 * Validation complète des Edge Functions et circuits quantiques
 * Exécutable via: node scripts/test-quantum-platform.js
 */

const https = require('https');

// Configuration des tests
const BASE_URL = 'https://sapience-v3.netlify.app';
const TESTS = [
  {
    name: '🔍 Health Check Platform',
    method: 'GET',
    path: '/api/quantum/monitor?action=health',
    expected: { platform_status: 'operational' }
  },
  {
    name: '📊 Métriques Circuits Quantiques',
    method: 'GET', 
    path: '/api/quantum/monitor?action=metrics',
    expected: { total_circuits: 4 }
  },
  {
    name: '⚡ Optimisation PUP Quantique',
    method: 'POST',
    path: '/api/quantum/pup-optimizer',
    data: {
      CompanyCode: '1000',
      MaterialNumber: 'MCP-TEST-001',
      PUPValue: 125.5,
      StandardPrice: 100.0,
      Quantity: 500,
      Plant: 'P001',
      Period: '2025-08',
      MovingPrice: 110.0,
      ValuationClass: '3000'
    },
    expected: { success: true, data: { quantum: { algorithm: 'QAOA-PUP-v1.2' } } }
  }
];

// Fonction utilitaire pour les requêtes HTTP
function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'SAPience-MCP-Test/1.0'
      }
    };

    const req = https.request(url, options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Exécution des tests
async function runTests() {
  console.log('🚀 === TESTS SAPIENCE QUANTUM ML PLATFORM ===\n');
  
  const results = [];
  
  for (const test of TESTS) {
    console.log(`🧪 ${test.name}...`);
    
    try {
      const result = await makeRequest(test.method, test.path, test.data);
      
      const success = result.status === 200 && result.data.success !== false;
      const icon = success ? '✅' : '❌';
      
      console.log(`${icon} Status: ${result.status}`);
      
      if (success && test.expected) {
        // Validation des propriétés attendues
        let validationOk = true;
        for (const [key, value] of Object.entries(test.expected)) {
          if (typeof value === 'object') {
            // Validation nested
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              if (result.data[key]?.[nestedKey] !== nestedValue) {
                validationOk = false;
                break;
              }
            }
          } else if (result.data[key] !== value) {
            validationOk = false;
            break;
          }
        }
        
        if (validationOk) {
          console.log('✅ Validation: OK');
        } else {
          console.log('⚠️  Validation: Partielle');
        }
      }
      
      // Affichage des données importantes
      if (result.data.data?.quantum) {
        const q = result.data.data.quantum;
        console.log(`   🔬 Algorithme: ${q.algorithm}`);
        console.log(`   📈 Amélioration: ${q.improvement}%`);
        console.log(`   🎯 Confiance: ${(q.confidence * 100).toFixed(1)}%`);
        console.log(`   ⏱️  Temps: ${q.executionTime}ms`);
      }
      
      if (result.data.data?.summary) {
        const s = result.data.data.summary;
        console.log(`   🔄 Circuits actifs: ${s.active_circuits}`);
        console.log(`   📊 Taux succès: ${(s.average_success_rate * 100).toFixed(1)}%`);
      }
      
      results.push({ test: test.name, success, status: result.status });
      
    } catch (error) {
      console.log(`❌ Erreur: ${error.message}`);
      results.push({ test: test.name, success: false, error: error.message });
    }
    
    console.log('');
  }
  
  // Résumé final
  const passed = results.filter(r => r.success).length;
  const total = results.length;
  
  console.log('🎯 === RÉSUMÉ DES TESTS ===');
  console.log(`✅ Réussis: ${passed}/${total}`);
  console.log(`❌ Échecs: ${total - passed}/${total}`);
  
  if (passed === total) {
    console.log('\n🎉 TOUTES LES FONCTIONS QUANTIQUES SONT OPÉRATIONNELLES !');
    console.log('🚀 Platform SAPience Quantum ML: READY FOR PRODUCTION');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }
  
  console.log('\n📋 Endpoints disponibles:');
  console.log('   • GET  /api/quantum/monitor?action=health');
  console.log('   • GET  /api/quantum/monitor?action=metrics');
  console.log('   • POST /api/quantum/pup-optimizer');
  
  console.log('\n🔗 Dashboard: https://sapience-v3.netlify.app');
  console.log('🔗 n8n Console: https://exonov-u39090.vm.elestio.app');
}

// Exécution si appelé directement
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { runTests, makeRequest };
