'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Zap, TrendingUp, Activity, CheckCircle2 } from 'lucide-react';

interface SAPData {
  CompanyCode: string;
  MaterialNumber: string;
  Plant: string;
  Period: string;
  PUPValue: number;
  StandardPrice: number;
  MovingPrice: number;
  Quantity: number;
  ValuationClass: string;
}

interface QuantumResult {
  optimizedPUP: number;
  confidence: number;
  quantumStates: string[];
  classicalPUP: number;
  improvement: number;
  circuitDepth: number;
  executionTime: number;
  algorithm: string;
}

interface QuantumResponse {
  success: boolean;
  data: {
    input: SAPData;
    quantum: QuantumResult;
    n8n: {
      triggered: boolean;
      workflowId?: string;
      status: string;
    };
    metadata: {
      version: string;
      algorithm: string;
      processing_time_ms: number;
      improvement_percentage: number;
      confidence_score: number;
    };
  };
  timestamp: string;
}

interface MonitoringData {
  total_circuits: number;
  metrics: Array<{
    circuitId: string;
    executionCount: number;
    averageExecutionTime: number;
    successRate: number;
    quantumAdvantage: number;
    lastExecution: string;
    errorRate: number;
  }>;
  summary: {
    total_executions: number;
    average_success_rate: number;
    best_quantum_advantage: number;
    active_circuits: number;
  };
}

export default function QuantumPUPOptimizer() {
  const [sapData, setSapData] = useState<SAPData>({
    CompanyCode: '1000',
    MaterialNumber: '',
    Plant: 'P001',
    Period: new Date().toISOString().substr(0, 7),
    PUPValue: 0,
    StandardPrice: 0,
    MovingPrice: 0,
    Quantity: 0,
    ValuationClass: '3000'
  });

  const [result, setResult] = useState<QuantumResponse | null>(null);
  const [monitoring, setMonitoring] = useState<MonitoringData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch monitoring data on component mount
  useEffect(() => {
    fetchMonitoringData();
  }, []);

  const fetchMonitoringData = async () => {
    try {
      const response = await fetch('/api/quantum/monitor?action=metrics');
      if (response.ok) {
        const data = await response.json();
        setMonitoring(data.data);
      }
    } catch (err) {
      console.error('Erreur monitoring:', err);
    }
  };

  const optimizePUP = async () => {
    if (!sapData.MaterialNumber || sapData.PUPValue <= 0 || sapData.StandardPrice <= 0) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/quantum/pup-optimizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sapData)
      });

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      const data: QuantumResponse = await response.json();
      setResult(data);
      
      // Refresh monitoring data
      fetchMonitoringData();
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  const generateTestData = () => {
    setSapData({
      ...sapData,
      MaterialNumber: 'MAT-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      PUPValue: 100 + Math.random() * 100,
      StandardPrice: 80 + Math.random() * 40,
      MovingPrice: 90 + Math.random() * 30,
      Quantity: Math.floor(Math.random() * 1000) + 100
    });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          <Zap className="inline-block w-8 h-8 mr-2 text-blue-600" />
          Optimiseur PUP Quantique
        </h1>
        <p className="text-gray-600">
          Optimisation des Prix Unitaires Pondérés via circuits quantiques QAOA
        </p>
      </div>

      {/* Monitoring Cards */}
      {monitoring && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Circuits Actifs</p>
                  <p className="text-2xl font-bold text-blue-600">{monitoring.summary.active_circuits}</p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de Succès</p>
                  <p className="text-2xl font-bold text-green-600">
                    {(monitoring.summary.average_success_rate * 100).toFixed(1)}%
                  </p>
                </div>
                <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avantage Quantique</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {monitoring.summary.best_quantum_advantage.toFixed(3)}x
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Exécutions Totales</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {monitoring.summary.total_executions.toLocaleString()}
                  </p>
                </div>
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Données SAP</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="companyCode">Code Société</Label>
              <Input
                id="companyCode"
                value={sapData.CompanyCode}
                onChange={(e) => setSapData({...sapData, CompanyCode: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="materialNumber">Numéro Article *</Label>
              <Input
                id="materialNumber"
                value={sapData.MaterialNumber}
                onChange={(e) => setSapData({...sapData, MaterialNumber: e.target.value})}
                placeholder="Ex: MAT-001"
              />
            </div>

            <div>
              <Label htmlFor="plant">Division</Label>
              <Input
                id="plant"
                value={sapData.Plant}
                onChange={(e) => setSapData({...sapData, Plant: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="pupValue">Valeur PUP *</Label>
              <Input
                id="pupValue"
                type="number"
                step="0.01"
                value={sapData.PUPValue}
                onChange={(e) => setSapData({...sapData, PUPValue: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="standardPrice">Prix Standard *</Label>
              <Input
                id="standardPrice"
                type="number"
                step="0.01"
                value={sapData.StandardPrice}
                onChange={(e) => setSapData({...sapData, StandardPrice: parseFloat(e.target.value) || 0})}
              />
            </div>

            <div>
              <Label htmlFor="quantity">Quantité *</Label>
              <Input
                id="quantity"
                type="number"
                value={sapData.Quantity}
                onChange={(e) => setSapData({...sapData, Quantity: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={optimizePUP} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Optimisation...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Optimiser avec QAOA
                </>
              )}
            </Button>

            <Button 
              onClick={generateTestData} 
              variant="outline"
              disabled={loading}
            >
              Générer Données Test
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Résultats d'Optimisation Quantique
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900">PUP Optimisé</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {result.data.quantum.optimizedPUP.toFixed(2)} €
                </p>
                <p className="text-sm text-blue-700">
                  vs {result.data.quantum.classicalPUP.toFixed(2)} € (classique)
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-900">Amélioration</h3>
                <p className="text-2xl font-bold text-green-600">
                  {result.data.quantum.improvement > 0 ? '+' : ''}{result.data.quantum.improvement.toFixed(2)}%
                </p>
                <p className="text-sm text-green-700">
                  Algorithme {result.data.quantum.algorithm}
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-900">Confiance</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {(result.data.quantum.confidence * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-purple-700">
                  Temps: {result.data.quantum.executionTime}ms
                </p>
              </div>
            </div>

            {/* Quantum States */}
            <div>
              <h3 className="font-semibold mb-3">États Quantiques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {result.data.quantum.quantumStates.map((state, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="justify-center p-2 font-mono"
                  >
                    {state}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Workflow Status */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Status Workflow n8n</h3>
              <div className="flex items-center gap-2">
                <Badge 
                  variant={result.data.n8n.triggered ? "default" : "destructive"}
                  className={result.data.n8n.triggered ? "bg-green-600" : "bg-red-600"}
                >
                  {result.data.n8n.triggered ? 'Déclenché' : 'Échec'}
                </Badge>
                <span className="text-sm text-gray-600">
                  Status: {result.data.n8n.status}
                </span>
                {result.data.n8n.workflowId && (
                  <span className="text-xs text-gray-500">
                    ID: {result.data.n8n.workflowId}
                  </span>
                )}
              </div>
            </div>

            {/* Technical Details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Détails Techniques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Version:</span>
                  <p>{result.data.metadata.version}</p>
                </div>
                <div>
                  <span className="font-medium">Circuit:</span>
                  <p>{result.data.quantum.circuitDepth} portes</p>
                </div>
                <div>
                  <span className="font-medium">Timestamp:</span>
                  <p>{new Date(result.timestamp).toLocaleTimeString()}</p>
                </div>
                <div>
                  <span className="font-medium">Matériel:</span>
                  <p>{result.data.input.MaterialNumber}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Circuit Performance Details */}
      {monitoring && (
        <Card>
          <CardHeader>
            <CardTitle>Performance des Circuits Quantiques</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monitoring.metrics.map((metric, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{metric.circuitId}</h4>
                      <p className="text-sm text-gray-600">
                        {metric.executionCount} exécutions • 
                        Temps moyen: {metric.averageExecutionTime.toFixed(1)}ms
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant="outline"
                        className={metric.successRate > 0.9 ? "border-green-500 text-green-700" : "border-yellow-500 text-yellow-700"}
                      >
                        {(metric.successRate * 100).toFixed(1)}% succès
                      </Badge>
                      <p className="text-sm text-gray-500 mt-1">
                        Avantage: {metric.quantumAdvantage.toFixed(3)}x
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
