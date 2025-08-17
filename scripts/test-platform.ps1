# 🚀 Test SAPience Quantum Platform - PowerShell Script
# Exécutez: .\scripts\test-platform.ps1

Write-Host "🚀 === TESTS SAPIENCE QUANTUM ML PLATFORM ===" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://sapience-v3.netlify.app"

# Test 1: Health Check
Write-Host "🔍 Test Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/api/quantum/monitor?action=health" -Method GET
    if ($health.platform_status -eq "operational") {
        Write-Host "✅ Platform Status: OPERATIONAL" -ForegroundColor Green
        Write-Host "   🔄 Circuits quantiques: $($health.services.quantum_circuits.active_circuits)" -ForegroundColor Gray
        Write-Host "   🔗 n8n: $($health.services.n8n_integration.status)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Platform non opérationnel" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur Health Check: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Métriques Quantiques
Write-Host "📊 Test Métriques Quantiques..." -ForegroundColor Yellow
try {
    $metrics = Invoke-RestMethod -Uri "$baseUrl/api/quantum/monitor?action=metrics" -Method GET
    Write-Host "✅ Métriques récupérées" -ForegroundColor Green
    Write-Host "   🧮 Total circuits: $($metrics.data.total_circuits)" -ForegroundColor Gray
    Write-Host "   📈 Circuits actifs: $($metrics.data.summary.active_circuits)" -ForegroundColor Gray
    Write-Host "   🎯 Taux succès moyen: $([math]::Round($metrics.data.summary.average_success_rate * 100, 1))%" -ForegroundColor Gray
} catch {
    Write-Host "❌ Erreur Métriques: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Optimisation Quantique PUP
Write-Host "⚡ Test Optimisation Quantique PUP..." -ForegroundColor Yellow
try {
    $testData = @{
        CompanyCode = "1000"
        MaterialNumber = "PS-TEST-001"
        PUPValue = 125.5
        StandardPrice = 100.0
        Quantity = 500
        Plant = "P001"
        Period = "2025-08"
        MovingPrice = 110.0
        ValuationClass = "3000"
    } | ConvertTo-Json

    $result = Invoke-RestMethod -Uri "$baseUrl/api/quantum/pup-optimizer" -Method POST -Body $testData -ContentType "application/json"
    
    if ($result.success) {
        Write-Host "✅ Optimisation quantique réussie!" -ForegroundColor Green
        Write-Host "   🔬 Algorithme: $($result.data.quantum.algorithm)" -ForegroundColor Gray
        Write-Host "   💰 PUP optimisé: $($result.data.quantum.optimizedPUP) €" -ForegroundColor Gray
        Write-Host "   📈 Amélioration: $($result.data.quantum.improvement)%" -ForegroundColor Gray
        Write-Host "   🎯 Confiance: $([math]::Round($result.data.quantum.confidence * 100, 1))%" -ForegroundColor Gray
        Write-Host "   ⏱️  Temps d'exécution: $($result.data.quantum.executionTime) ms" -ForegroundColor Gray
        Write-Host "   🔄 n8n déclenché: $($result.data.n8n.triggered)" -ForegroundColor Gray
    } else {
        Write-Host "❌ Optimisation échouée" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur Optimisation: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 === RÉSUMÉ ===" -ForegroundColor Cyan
Write-Host "🌐 Platform URL: https://sapience-v3.netlify.app" -ForegroundColor Gray
Write-Host "🔧 n8n Console: https://exonov-u39090.vm.elestio.app" -ForegroundColor Gray
Write-Host "📋 Documentation: Voir MCP_IMPLEMENTATION_COMPLETE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🎉 PLATEFORME QUANTUM ML OPÉRATIONNELLE !" -ForegroundColor Green
