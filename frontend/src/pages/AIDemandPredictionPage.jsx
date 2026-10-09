import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Calendar,
  CloudSun,
  Users,
  Droplets,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import axios from 'axios';

export const AIDemandPredictionPage = () => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Scenario simulator inputs
  const [simOccupancy, setSimOccupancy] = useState(820);
  const [simTemperature, setSimTemperature] = useState(31);
  const [simPrevConsumption, setSimPrevConsumption] = useState(17500);
  const [simCurrentStorage, setSimCurrentStorage] = useState(14200);
  const [simResult, setSimResult] = useState(null);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    fetchDemandData();
  }, []);

  const fetchDemandData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/ai/demand-predictions');
      setForecast(res.data.current);
      setSimResult(res.data.current);
    } catch (e) {
      console.warn('Error fetching demand:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const runCustomSimulation = async () => {
    try {
      setCalculating(true);
      const res = await axios.post('/api/ai/demand-predict', {
        previous_consumption: simPrevConsumption,
        occupancy: simOccupancy,
        temperature: simTemperature,
        current_storage: simCurrentStorage,
        storage_capacity: 25000
      });
      setSimResult(res.data);
    } catch (e) {
      alert(e.response?.data?.message || 'Simulation error');
    } finally {
      setCalculating(false);
    }
  };

  const activeData = simResult || forecast || {
    predicted_demand: 18500,
    current_available: 14200,
    expected_shortage: 4300,
    risk_level: 'HIGH',
    days_remaining: 0.8,
    recommendation: 'Increase water storage by approximately 4,500 L immediately to reduce shortage risk.',
    daily_forecast: [
      { day: 'Mon', predicted_demand: 16800, storage_buffer: 8200 },
      { day: 'Tue', predicted_demand: 17200, storage_buffer: 7800 },
      { day: 'Wed', predicted_demand: 18500, storage_buffer: 6500 },
      { day: 'Thu', predicted_demand: 18100, storage_buffer: 6900 },
      { day: 'Fri', predicted_demand: 19400, storage_buffer: 5600 },
      { day: 'Sat', predicted_demand: 21200, storage_buffer: 3800 },
      { day: 'Sun', predicted_demand: 20800, storage_buffer: 4200 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
          <TrendingUp className="w-4 h-4" />
          <span>Random Forest Regressor Forecast</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          AI Water Demand Prediction & Forecasting
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Projects water requirements using demographic occupancy, calendar season, and ambient weather telemetry.
        </p>
      </div>

      {/* Tomorrow's Demand & Shortage Risk Callout Card (Exact Specification Layout) */}
      <div className="bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/20">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-200">
              Tomorrow's Water Demand Projection
            </span>
            <h2 className="text-3xl font-extrabold mt-1">
              {activeData.predicted_demand?.toLocaleString()} Litres
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
              activeData.risk_level === 'HIGH' || activeData.risk_level === 'CRITICAL'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                : activeData.risk_level === 'MODERATE'
                ? 'bg-amber-400 text-slate-900'
                : 'bg-emerald-400 text-slate-900'
            }`}>
              Shortage Risk: {activeData.risk_level}
            </span>
          </div>
        </div>

        {/* 4 Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-xs text-cyan-100">Current Storage</p>
            <p className="text-2xl font-extrabold mt-1">{activeData.current_available?.toLocaleString()} L</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-xs text-cyan-100">Predicted Demand</p>
            <p className="text-2xl font-extrabold mt-1">{activeData.predicted_demand?.toLocaleString()} L</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-xs text-rose-200">Expected Shortage</p>
            <p className="text-2xl font-extrabold text-rose-200 mt-1">
              {activeData.expected_shortage > 0 ? `${activeData.expected_shortage?.toLocaleString()} L` : '0 L (Safe)'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <p className="text-xs text-cyan-100">Storage Buffer Time</p>
            <p className="text-2xl font-extrabold mt-1">{activeData.days_remaining} Days</p>
          </div>
        </div>

        {/* System Recommendation Banner */}
        <div className="p-4 bg-white/15 backdrop-blur-md rounded-2xl border border-white/30 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-yellow-200 uppercase tracking-wide">
              HydroSense Preventive Action Recommendation
            </p>
            <p className="text-xs sm:text-sm text-white font-medium mt-0.5">
              “{activeData.recommendation}”
            </p>
          </div>
        </div>
      </div>

      {/* 7-Day Demand Forecast Chart */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            7-Day Projected Demand vs Tank Buffer Capacity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Machine learning forecast across the upcoming week
          </p>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData.daily_forecast}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" unit=" L" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#bae6fd' }}
                formatter={(val, name) => [`${val.toLocaleString()} L`, name === 'predicted_demand' ? 'Predicted Demand' : 'Storage Buffer']}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="predicted_demand" name="Predicted Demand (L)" fill="#0284c7" radius={[6, 6, 0, 0]} />
              <Bar dataKey="storage_buffer" name="Remaining Reserve Buffer (L)" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Scenario Simulator: Tweak Occupancy & Temperature */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Demand Sensitivity Simulator (What-If Scenario)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate occupancy surges, heatwaves, or weekend load on the ML regressor
            </p>
          </div>
          <button
            onClick={runCustomSimulation}
            disabled={calculating}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition"
          >
            {calculating ? 'Forecasting...' : 'Run ML Forecast'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Building Occupancy ({simOccupancy} persons)
            </label>
            <input
              type="range"
              min="400"
              max="1500"
              value={simOccupancy}
              onChange={(e) => setSimOccupancy(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ambient Temperature ({simTemperature}°C)
            </label>
            <input
              type="range"
              min="15"
              max="45"
              value={simTemperature}
              onChange={(e) => setSimTemperature(Number(e.target.value))}
              className="w-full accent-sky-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Yesterday Demand (Litres)
            </label>
            <input
              type="number"
              value={simPrevConsumption}
              onChange={(e) => setSimPrevConsumption(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Current Storage (Litres)
            </label>
            <input
              type="number"
              value={simCurrentStorage}
              onChange={(e) => setSimCurrentStorage(Number(e.target.value))}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemandPredictionPage;
