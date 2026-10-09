import React, { useState, useEffect } from 'react';
import {
  Droplets,
  AlertTriangle,
  TrendingDown,
  Calendar,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import axios from 'axios';

export const WaterAvailabilityPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/water/availability');
      setData(res.data);
    } catch (e) {
      console.warn('Availability load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const currentAvailable = data?.currentStorage || 18400;
  const totalCapacity = data?.storageCapacity || 25000;
  const percentage = data?.availablePercentage || 73.6;
  const daysRemaining = data?.estimatedRemainingDays || 1.8;
  const predictedDemand = data?.dailyDemand || 20200;
  const risk = data?.shortageRisk || 'MODERATE';
  const tanks = data?.tanks || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Droplets className="w-4 h-4" />
          <span>Storage & Reserves Telemetry</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Water Availability & Shortage Prediction
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time reserve tank levels, burn rate estimations, and shortage risk analysis.
        </p>
      </div>

      {/* Main Tank Visual Graphic & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Water Tank Graphic */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Total Grid Storage Level</h3>

          {/* Visual Cylinder Reservoir Tank */}
          <div className="relative w-44 h-64 rounded-3xl border-4 border-sky-300 bg-sky-50/50 overflow-hidden shadow-inner flex flex-col justify-end p-1">
            {/* Measurement lines */}
            <div className="absolute top-4 left-2 right-2 border-b border-dashed border-sky-300/60 text-[9px] text-sky-400 text-right pr-1">100% (25K L)</div>
            <div className="absolute top-1/4 left-2 right-2 border-b border-dashed border-sky-300/60 text-[9px] text-sky-400 text-right pr-1">75%</div>
            <div className="absolute top-1/2 left-2 right-2 border-b border-dashed border-sky-300/60 text-[9px] text-sky-400 text-right pr-1">50%</div>
            <div className="absolute top-3/4 left-2 right-2 border-b border-dashed border-sky-300/60 text-[9px] text-sky-400 text-right pr-1">25%</div>

            {/* Rising Water Level */}
            <div
              className="w-full bg-gradient-to-t from-blue-600 via-sky-500 to-cyan-400 rounded-b-2xl transition-all duration-1000 relative overflow-hidden"
              style={{ height: `${percentage}%` }}
            >
              {/* Wave surface shimmer */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-white/30 animate-pulse" />
              {/* Internal bubbles */}
              <div className="absolute bottom-4 left-6 w-2 h-2 rounded-full bg-white/40 animate-float" />
              <div className="absolute bottom-10 right-8 w-3 h-3 rounded-full bg-white/40 animate-float" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          <p className="text-3xl font-extrabold text-sky-700 mt-4">{percentage}%</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentAvailable.toLocaleString()} L / {totalCapacity.toLocaleString()} L
          </p>
        </div>

        {/* Shortage Risk & Metrics */}
        <div className="lg:col-span-2 space-y-4 flex flex-col justify-between">
          {/* Risk Alert Box */}
          <div className={`p-5 rounded-2xl border ${
            risk === 'CRITICAL' || risk === 'HIGH'
              ? 'bg-rose-50 border-rose-200 text-rose-900'
              : risk === 'MODERATE'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center space-x-2">
              <AlertTriangle className={`w-5 h-5 ${
                risk === 'HIGH' ? 'text-rose-600' : 'text-amber-600'
              }`} />
              <span className="text-xs font-bold uppercase tracking-wider">
                Shortage Risk Status: {risk}
              </span>
            </div>
            <p className="text-sm font-semibold mt-2">
              {risk === 'HIGH' || risk === 'MODERATE'
                ? 'High water demand is projected tomorrow against present storage volume. Increase storage buffer by approx 4,500 L before peak morning cycles to prevent supply interruption.'
                : 'Campus water reserves are ample. Current storage buffer can sustain nominal consumption for over 48 hours without auxiliary refill.'}
            </p>
          </div>

          {/* Key Metric Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Storage Capacity</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{totalCapacity.toLocaleString()} L</p>
              <span className="text-[10px] text-slate-500">Overhead + Sumps</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Current Storage</p>
              <p className="text-xl font-extrabold text-sky-700 mt-1">{currentAvailable.toLocaleString()} L</p>
              <span className="text-[10px] text-emerald-600 font-bold">Active Reserves</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Estimated Remaining</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">{daysRemaining} Days</p>
              <span className="text-[10px] text-slate-500">At current burn rate</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Predicted Demand</p>
              <p className="text-xl font-extrabold text-amber-600 mt-1">{predictedDemand.toLocaleString()} L</p>
              <span className="text-[10px] text-slate-500">ML 24h projection</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Expected Shortage</p>
              <p className="text-xl font-extrabold text-rose-600 mt-1">
                {Math.max(0, predictedDemand - currentAvailable).toLocaleString()} L
              </p>
              <span className="text-[10px] text-rose-500">Deficit buffer</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
              <p className="text-[11px] font-bold text-slate-400 uppercase">Refill Frequency</p>
              <p className="text-xl font-extrabold text-slate-900 mt-1">2 Cycles / day</p>
              <span className="text-[10px] text-slate-500">Municipal schedule</span>
            </div>
          </div>
        </div>
      </div>

      {/* Building-wise Tank Reserves Breakdown */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Individual Building Reservoir Status
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sensors and telemetry by residential block
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tanks.map((t) => (
            <div key={t.id} className="p-4 rounded-2xl border border-sky-100 bg-slate-50/60 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[10px] text-slate-500">{t.zone}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  t.status === 'POSSIBLE LEAK'
                    ? 'bg-rose-100 text-rose-700'
                    : t.status === 'LOW STORAGE'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {t.status}
                </span>
              </div>

              {/* Tank Progress Bar */}
              <div>
                <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>{t.percentage}% Available</span>
                  <span className="text-slate-400">{t.currentStorage.toLocaleString()} / {t.capacity.toLocaleString()} L</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      t.percentage < 35
                        ? 'bg-rose-500'
                        : t.percentage < 60
                        ? 'bg-amber-500'
                        : 'bg-gradient-to-r from-cyan-500 to-sky-600'
                    }`}
                    style={{ width: `${t.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WaterAvailabilityPage;
