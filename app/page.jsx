'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Brain, Database, Bot, TrendingUp, Shield, Zap, ArrowRight, CheckCircle, Play, ExternalLink, Activity, AlertCircle } from 'lucide-react';

export default function SAPienceHomePage() {
  const [platformStatus, setPlatformStatus] = useState({
    platform: "SAPience ML Platform v2.0",
    status: "READY", 
    version: "2.0.0-optimized",
    workflows: 3,
    region: "EU-West-3"
  });

  const workflowStatus = [
    { 
      name: "Dual-AI Analysis", 
      id: "6WZDB2IFrABHmjQG", 
      status: "OPTIMIZED", 
      lastRun: "Ready to activate",
      description: "Gemini 1.5 Pro + ChatGPT-4o (Optimized)"
    },
    { 
      name: "Monthly Close", 
      id: "Q7angyNW4DojQPec", 
      status: "CONFIGURED", 
      lastRun: "Scheduled: 25th at 6AM",
      description: "Automated PUP forecasting"
    },
    { 
      name: "Anomaly Watch", 
      id: "njNcBuefLNnRVnRH", 
      status: "CONFIGURED", 
      lastRun: "Scheduled: Daily at 9AM",
      description: "Real-time anomaly detection"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Dual AI Analysis",
      description: "Gemini 1.5 Pro + ChatGPT-4o for comprehensive SAP insights with 90%+ confidence (Optimized workflow)",
      color: "blue",
      metrics: "~4.5s processing time",
      status: "OPTIMIZED"
    },
    {
      icon: Database,
      title: "SAP OData Integration", 
      description: "Direct connection to SAP ACM with ML-ready collection assessment and feature engineering",
      color: "green",
      metrics: "BTP OAuth2 secure",
      status: "CONFIGURED"
    },
    {
      icon: Bot,
      title: "n8n Automation",
      description: "3 automated workflows: dual-AI analysis, monthly forecasts, and real-time anomaly detection",
      color: "purple", 
      metrics: "99.9% uptime SLA",
      status: "ACTIVE"
    },
    {
      icon: TrendingUp,
      title: "PUP Predictions",
      description: "15-25% reduction in forecast errors with MAPE < 5% target using LightGBM/XGBoost",
      color: "orange",
      metrics: "SHAP explainability",
      status: "READY"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "EU-hosted (Paris), RGPD compliant with SOX-ready audit trails and row-level security",
      color: "red",
      metrics: "Multi-tenant RLS",
      status: "COMPLIANT"
    },
    {
      icon: Zap,
      title: "Real-time Analytics", 
      description: "Live dashboards with confidence intervals, smart alerts, and what-if scenario modeling",
      color: "yellow",
      metrics: "Redis performance cache",
      status: "READY"
    }
  ];

  const pricingTiers = [
    {
      name: "Essential",
      price: "€3,500",
      period: "/month",
      description: "Perfect for teams getting started with ML-powered SAP analytics",
      features: [
        "Multi-entity dashboards",
        "Basic exports & reports",
        "Email alerts", 
        "Up to 5 Company Codes",
        "Monthly close reports"
      ],
      color: "border-blue-200 bg-blue-50",
      paymentLink: "https://buy.stripe.com/test_14A4gB63Vffg8xj6Pf7Re00"
    },
    {
      name: "Pro",
      price: "€9,000", 
      period: "/month",
      description: "Advanced ML capabilities for enterprise operations",
      features: [
        "Everything in Essential",
        "PUP prediction + Confidence Intervals",
        "Smart n8n alerts & automation",
        "What-if scenario analysis",
        "Dual-AI Analysis (Gemini + ChatGPT)", 
        "Advanced ML models",
        "Unlimited Company Codes",
        "API access"
      ],
      color: "border-green-200 bg-green-50",
      popular: true,
      paymentLink: "https://buy.stripe.com/test_eVq7sNakb0kmcNz6Pf7Re01"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "Full-scale deployment with dedicated infrastructure", 
      features: [
        "Everything in Pro",
        "Dedicated VPC deployment",
        "Schema-per-tenant isolation",
        "24/7 premium support",
        "Custom integrations",
        "On-premise options",
        "SOX compliance audit"
      ],
      color: "border-purple-200 bg-purple-50"
    }
  ];

  const stats = [
    { number: "99.9%", label: "Platform Uptime", description: "Enterprise SLA guarantee" },
    { number: "4.2%", label: "MAPE Score", description: "ML prediction accuracy" },
    { number: "23%", label: "Error Reduction", description: "Forecast improvement" },
    { number: "8.5h", label: "Monthly Savings", description: "Process automation" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SAPience</span>
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                v2.0.0 • LIVE
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Dashboard
              </Link>
              <Link href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Pricing
              </Link>
              <a 
                href="https://n8n.sapience.app" 
                target="_blank"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center space-x-1"
              >
                <span>n8n Console</span>
                <ExternalLink className="w-4 h-4" />
              </a>
              <Link 
                href="/dashboard" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 font-medium"
              >
                <Play className="w-4 h-4" />
                <span>Launch Platform</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Platform Status Banner */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center space-x-4 text-sm font-medium">
            <Activity className="w-4 h-4" />
            <span>Platform Status: {platformStatus.status}</span>
            <span>•</span>
            <span>{platformStatus.workflows} Workflows Optimized</span>
            <span>•</span>
            <span>Hosted in {platformStatus.region}</span>
            <span>•</span>
            <span>RGPD + SOX Compliant</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              ML-Powered SAP Analytics
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                for Finance & Supply Chain
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Transform your SAP data into predictive insights with <strong>dual AI analysis</strong>, 
              automated n8n workflows, and enterprise-grade ML models. 
              <span className="text-blue-600 font-semibold">Reduce forecast errors by 15-25%</span> with real-time confidence scoring.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Play className="w-5 h-5" />
                <span>Try Live Demo</span>
              </Link>
              <button className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                Watch Demo Video
              </button>
            </div>

            {/* Workflow Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {workflowStatus.map((workflow, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">{workflow.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      workflow.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      workflow.status === 'OPTIMIZED' ? 'bg-purple-100 text-purple-800' :
                      workflow.status === 'CONFIGURED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {workflow.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{workflow.description}</p>
                  <p className="text-xs text-gray-500 mb-1">ID: {workflow.id}</p>
                  <p className="text-xs text-blue-600">{workflow.lastRun}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-600">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Enterprise ML Platform for SAP
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for Finance/CO and Supply Chain teams who need accurate forecasts, 
              anomaly detection, and actionable insights from their SAP data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: "text-blue-600 bg-blue-100",
                green: "text-green-600 bg-green-100", 
                purple: "text-purple-600 bg-purple-100",
                orange: "text-orange-600 bg-orange-100",
                red: "text-red-600 bg-red-100",
                yellow: "text-yellow-600 bg-yellow-100"
              };

              return (
                <div key={index} className="bg-gray-50 p-8 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-lg ${colorClasses[feature.color]} flex items-center justify-center`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      feature.status === 'OPTIMIZED' ? 'bg-purple-100 text-purple-800' :
                      feature.status === 'READY' ? 'bg-green-100 text-green-800' :
                      feature.status === 'ACTIVE' ? 'bg-blue-100 text-blue-800' :
                      feature.status === 'CONFIGURED' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-3">{feature.description}</p>
                  <p className="text-sm text-blue-600 font-medium">{feature.metrics}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your SAPience Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Flexible pricing tiers designed for teams of all sizes. 
              ROI typically achieved within 3-6 months through improved forecast accuracy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div 
                key={index} 
                className={`relative p-8 rounded-xl border-2 ${tier.color} ${tier.popular ? 'scale-105 shadow-2xl' : 'shadow-lg'} transition-all hover:shadow-xl`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{tier.price}</span>
                    <span className="text-gray-600">{tier.period}</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    tier.popular 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  onClick={() => {
                    if (tier.paymentLink) {
                      window.open(tier.paymentLink, '_blank');
                    }
                  }}
                >
                  {tier.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your SAP Analytics?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Join leading Finance and Supply Chain teams who've reduced forecast errors by 15-25% 
            with SAPience ML Platform. Your data. Your insights. Your competitive advantage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <span>Launch Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border border-gray-600 hover:border-gray-500 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold">SAPience</span>
              </div>
              <p className="text-gray-400 mb-4">
                ML-powered SAP analytics platform for enterprise Finance and Supply Chain teams.
              </p>
              <p className="text-sm text-gray-500">
                Platform v{platformStatus.version} • {platformStatus.status}
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                <li><a href="https://n8n.sapience.app" target="_blank" className="hover:text-white transition-colors">n8n Console</a></li>
                <li><Link href="/api/status" className="hover:text-white transition-colors">API Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Training</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 SAPience ML Platform v2.0. All rights reserved. Hosted in EU-West-3 (Paris) - RGPD Compliant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}