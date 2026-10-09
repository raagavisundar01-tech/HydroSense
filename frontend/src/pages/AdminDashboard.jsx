import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Droplets,
  Activity,
  TrendingUp,
  ClipboardList,
  AlertTriangle,
  MapPin,
  FileText,
  Users,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Building
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
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [consumptionTrends, setConsumptionTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [dashRes, conRes] = await Promise.all([
        axios.get('/api/admin/dashboard'),
        axios.get('/api/water/consumption?range=7days')
      ]);

      setData(dashRes.data);

      const formatted = (conRes.data.data || []).slice(-14).map((d) => ({
        time: new Date(d.timestamp).toLocaleDateString([], { weekday: 'short', hour: '2-digit' }),
        litres: d.consumption
      }));
      setConsumptionTrends(formatted);
    } catch (e) {
      console.warn('Admin dashboard load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const kpis = data?.kpis || {
    totalConsumptionToday: 25480,
    currentStorage: 18400,
    storageCapacity: 25000,
    storagePercentage: 73.6,
    activeComplaints: 2,
    resolvedComplaints: 1,
    activeLeakAlerts: 1,
    predictedDemandTomorrow: 18500,
    expectedShortage: 4300,
    shortageRisk: 'HIGH',
    daysRemaining: 1.1
  };

  const buildings = data?.buildings || [
    { name: 'Block A - Lotus Wing', status: 'NORMAL', percentage: 74 },
    { name: 'Block B - Emerald Wing', status: 'HIGH USAGE', percentage: 52 },
    { name: 'Block C - Sapphire Wing', status: 'POSSIBLE LEAK', percentage: 56 },
    { name: 'Block D - Coral Wing', status: 'NORMAL', percentage: 76 },
    { name: 'Block E - Crystal Wing', status: 'LOW STORAGE', percentage: 29 }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Central Command Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-sky-700 via-cyan-700 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Central Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              HydroSense Campus Water Grid
            </h1>
            <p className="text-cyan-100 text-xs sm:text-sm mt-1 max-w-xl">
              Telemetry aggregated across 5 campus blocks, 32 smart flow meters, and dual AI forecasting nodes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/ai-leak-detection"
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-500/30 transition flex items-center space-x-1.5"
            >
              <Activity className="w-4 h-4" />
              <span>Inspect AI Leaks</span>
            </Link>
            <Link
              to="/campus-map"
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white font-bold text-xs rounded-xl backdrop-blur-md transition flex items-center space-x-1.5"
            >
              <MapPin className="w-4 h-4" />
              <span>Campus Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 7 KPI Cards (Exact Specification Layout) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Water Usage</p>
          <p className="text-xl font-extrabold text-slate-900 mt-1">{kpis.totalConsumptionToday.toLocaleString()} L</p>
          <span className="text-[10px] text-slate-400">Past 24 hours</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Water Availability</p>
          <p className="text-xl font-extrabold text-sky-700 mt-1">{kpis.storagePercentage}%</p>
          <span className="text-[10px] text-slate-400">{kpis.daysRemaining} Days buffer</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Complaints</p>
          <p className="text-xl font-extrabold text-amber-600 mt-1">{kpis.activeComplaints}</p>
          <span className="text-[10px] text-amber-600 font-semibold">In pipeline</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resolved Tickets</p>
          <p className="text-xl font-extrabold text-emerald-600 mt-1">{kpis.resolvedComplaints}</p>
          <span className="text-[10px] text-emerald-600 font-semibold">78% resolution rate</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Active Leak Alerts</p>
          <p className="text-xl font-extrabold text-rose-600 mt-1">{kpis.activeLeakAlerts}</p>
          <span className="text-[10px] text-rose-500 font-semibold">Block C flagged</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Predicted Demand</p>
          <p className="text-xl font-extrabold text-sky-800 mt-1">{kpis.predictedDemandTomorrow.toLocaleString()} L</p>
          <span className="text-[10px] text-slate-400">Tomorrow ML</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-sm water-card bg-rose-50/30">
          <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Shortage Risk</p>
          <p className="text-xl font-extrabold text-rose-600 mt-1">{kpis.shortageRisk}</p>
          <span className="text-[10px] text-rose-500 font-semibold">Deficit: {kpis.expectedShortage?.toLocaleString()} L</span>
        </div>
      </div>

      {/* Live Alert Panel (CRITICAL / HIGH / MEDIUM / LOW) */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-slate-900">Live Grid Alert & Incident Panel</h3>
          </div>
          <span className="text-xs text-slate-400">Auto-refreshed via Web Telemetry</span>
        </div>

        <div className="space-y-2">
          <Link
            to="/ai-leak-detection"
            className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 hover:bg-rose-100/80 transition flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                CRITICAL
              </span>
              <div>
                <p className="text-xs font-bold text-rose-900">
                  Possible leakage detected — Block C Floor 2 Riser
                </p>
                <p className="text-[11px] text-rose-700">
                  Current: 480 L/hr (Normal: 145 L/hr) • 91% Anomaly probability
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/demand-prediction"
            className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100/80 transition flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                HIGH
              </span>
              <div>
                <p className="text-xs font-bold text-amber-900">
                  High water shortage risk predicted tomorrow
                </p>
                <p className="text-[11px] text-amber-700">
                  Deficit buffer of 4,300 L anticipated. Schedule secondary sump pumping.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition" />
          </Link>

          <Link
            to="/complaints"
            className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 hover:bg-sky-100/80 transition flex items-center justify-between group"
          >
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-extrabold text-[10px] uppercase tracking-wider">
                MEDIUM
              </span>
              <div>
                <p className="text-xs font-bold text-sky-900">
                  Complaint CMP-2026-1042 pending for more than 24 hours
                </p>
                <p className="text-[11px] text-sky-700">
                  Low water pressure ticket in Block A Unit 302 assigned to Rajesh Kumar.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-sky-400 group-hover:translate-x-1 transition" />
          </Link>
        </div>
      </div>

      {/* Grid: Zone & Building Monitoring + Consumption Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Zone Monitoring List (Exact Specification Layout) */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Building & Zone Monitoring</h3>
            <Link to="/campus-map" className="text-xs font-bold text-sky-600 hover:underline">
              View on Leaflet Map →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {buildings.map((b, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">{b.name}</p>
                  <p className="text-[11px] text-slate-400">Storage fill: {b.percentage}%</p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                  b.status === 'POSSIBLE LEAK'
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : b.status === 'HIGH USAGE'
                    ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : b.status === 'LOW STORAGE'
                    ? 'bg-orange-100 text-orange-700 border border-orange-200'
                    : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                }`}>
                  {b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Telemetry Chart */}
        <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Campus Flow Telemetry Trend</h3>
            <Link to="/water-analytics" className="text-xs font-bold text-sky-600 hover:underline">
              Detailed Analytics →
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={consumptionTrends}>
                <defs>
                  <linearGradient id="adminFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} stroke="#cbd5e1" unit=" L" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#bae6fd' }}
                  formatter={(val) => [`${val} Litres`, 'Flow']}
                />
                <Area type="monotone" dataKey="litres" stroke="#0284c7" strokeWidth={2.5} fill="url(#adminFlowGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
