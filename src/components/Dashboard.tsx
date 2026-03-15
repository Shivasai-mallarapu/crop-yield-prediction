import React, { useState, useEffect, useRef } from 'react';
import { PredictionResult, DatasetStats, ModelMetrics } from '../types';
import PredictionForm from './PredictionForm';
import { AccuracyChart, FeatureImportanceChart, YieldTrendChart } from './Charts';
import { 
  TrendingUp, Database, Award, History, 
  ArrowUpRight, ArrowDownRight, Info,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export default function Dashboard() {
  const [lastPrediction, setLastPrediction] = useState<PredictionResult | null>(null);
  const [stats, setStats] = useState<DatasetStats | null>(null);
  const [metrics, setMetrics] = useState<ModelMetrics | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStats();
    fetchMetrics();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (lastPrediction && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [lastPrediction]);

  const fetchStats = async () => {
    const res = await fetch('/api/dataset-stats');
    setStats(await res.json());
  };

  const fetchMetrics = async () => {
    const res = await fetch('/api/model-metrics');
    setMetrics(await res.json());
  };

  const fetchHistory = async () => {
    const res = await fetch('/api/prediction-history');
    setHistory(await res.json());
  };

  const handleNewPrediction = (result: PredictionResult) => {
    setLastPrediction(result);
    setHistory(prev => [result, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Crop Yield Prediction using ML</h1>
            <p className="text-gray-500 mt-1">Real-time crop yield forecasting & agricultural analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white rounded-xl shadow-sm border border-black/5 flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-gray-600">Model: {metrics?.bestModel || 'Loading...'}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Records" 
            value={stats?.totalRecords.toLocaleString() || '...'} 
            icon={<Database className="w-5 h-5" />}
            trend="+12% from last season"
            trendType="up"
          />
          <StatCard 
            title="Avg Yield" 
            value={`${stats?.avgYield || '...'} t/ha`} 
            icon={<TrendingUp className="w-5 h-5" />}
            trend="+5.4% vs last year"
            trendType="up"
          />
          <StatCard 
            title="Model R² Score" 
            value={metrics?.r2.toString() || '...'} 
            icon={<Award className="w-5 h-5" />}
            trend="High Accuracy"
            trendType="up"
          />
          <StatCard 
            title="MAE" 
            value={metrics?.mae.toString() || '...'} 
            icon={<Info className="w-5 h-5" />}
            trend="Low Error Rate"
            trendType="down"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Predictor Section */}
          <div className="lg:col-span-4 space-y-6 order-1">
            <div className="flex items-center gap-2 px-2">
              <div className="w-1 h-6 bg-emerald-600 rounded-full" />
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">1. Prediction Tool</h2>
            </div>
            
            <div className="flex flex-col gap-6">
              <PredictionForm onPrediction={handleNewPrediction} />
              
              <AnimatePresence mode="wait">
                {lastPrediction && (
                  <motion.div
                    ref={resultRef}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="space-y-4"
                  >
                    <div className="bg-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-200/50 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-emerald-100 text-xs font-bold uppercase tracking-widest">Prediction Result</span>
                        <CheckCircle2 className="w-6 h-6 text-emerald-200" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-5xl font-black tracking-tight">{lastPrediction.expectedYield} <span className="text-xl font-medium opacity-80">t/ha</span></div>
                        <p className="text-emerald-100 text-sm font-medium">Confidence: {(lastPrediction.confidence * 100).toFixed(1)}%</p>
                      </div>
                      <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-4 text-xs">
                        <div className="bg-white/10 p-3 rounded-xl">
                          <p className="opacity-60 mb-1 uppercase font-bold">Crop</p>
                          <p className="font-bold text-sm">{lastPrediction.input.crop}</p>
                        </div>
                        <div className="bg-white/10 p-3 rounded-xl">
                          <p className="opacity-60 mb-1 uppercase font-bold">Soil pH</p>
                          <p className="font-bold text-sm">{lastPrediction.input.soilPh}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-md border border-blue-100">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                          <Info className="w-5 h-5 text-blue-600" />
                        </div>
                        <h3 className="font-bold text-gray-900">Expert Recommendation</h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed font-medium">
                        {lastPrediction.recommendation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Analysis Section */}
          <div className="lg:col-span-8 space-y-6 order-2 bg-white/50 p-6 rounded-3xl border border-gray-100">
            <div className="flex items-center gap-2 px-2">
              <div className="w-1 h-6 bg-blue-600 rounded-full" />
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">2. Model Analysis</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartWrapper title="Accuracy Comparison" subtitle="R² Score across algorithms">
                <AccuracyChart />
              </ChartWrapper>
              <ChartWrapper title="Feature Importance" subtitle="Impact factors on yield">
                <FeatureImportanceChart />
              </ChartWrapper>
            </div>

            <ChartWrapper title="Seasonal Yield Trends" subtitle="Average yield across seasons">
              {stats && <YieldTrendChart data={stats.seasonalTrends} />}
            </ChartWrapper>

            <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-xl font-bold text-gray-900">Recent History</h2>
                </div>
                <button onClick={fetchHistory} className="text-sm text-emerald-600 font-bold hover:underline">Refresh</button>
              </div>
              
              <div className="overflow-x-auto -mx-6 px-6">
                <table className="w-full text-left min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Time</th>
                      <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">Crop</th>
                      <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider">State</th>
                      <th className="pb-4 font-bold text-gray-400 text-xs uppercase tracking-wider text-right">Yield</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {history.map((item, i) => (
                      <tr key={i} className="group hover:bg-gray-50 transition-colors">
                        <td className="py-4 text-sm text-gray-500">{format(new Date(item.timestamp), 'HH:mm:ss')}</td>
                        <td className="py-4 text-sm font-bold text-gray-900">{item.input.crop}</td>
                        <td className="py-4 text-sm text-gray-600">{item.input.state}</td>
                        <td className="py-4 text-sm font-black text-emerald-600 text-right">{item.expectedYield} t/ha</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend, trendType }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-xs font-medium ${trendType === 'up' ? 'text-emerald-600' : 'text-blue-600'}`}>
          {trendType === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      </div>
    </div>
  );
}

function ChartWrapper({ title, subtitle, children }: any) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-black/5">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
