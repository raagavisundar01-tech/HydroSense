import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplets,
  Calendar,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
  Sparkles,
  ArrowUpRight,
  PlusCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import axios from 'axios';
import { DroppyCartoonSVG } from '../components/WaterMascotNotification';

export const ResidentDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [chartRange, setChartRange] = useState('7days');
  const [consumptionData, setConsumptionData] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [chartRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [compRes, anaRes, conRes, avaRes] = await Promise.all([
        axios.get('/api/complaints'),
        axios.get('/api/water/analytics'),
        axios.get(`/api/water/consumption?range=${chartRange}`),
        axios.get('/api/water/availability')
      ]);

      setComplaints(compRes.data.complaints || []);
      setAnalytics(anaRes.data);
      setAvailability(avaRes.data);

      // Format consumption data for Recharts
      const formatted = (conRes.data.data || []).slice(-14).map((d) => ({
        time: new Date(d.timestamp).toLocaleDateString([], { weekday: 'short', hour: '2-digit' }),
        litres: d.consumption,
        flow: d.flowRate,
        isAnomaly: d.isAnomaly
      }));
      setConsumptionData(formatted);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const openComplaintsCount = complaints.filter(
    (c) => c.status !== 'Resolved' && c.status !== 'Closed'
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Water Theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-600 via-cyan-600 to-blue-700 p-6 sm:p-8 text-white shadow-lg shadow-sky-600/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-cyan-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 text-cyan-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Resident Intelligence Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {user?.name || 'Resident'}! 💧
            </h1>
            <p className="mt-1 text-cyan-100 text-xs sm:text-sm max-w-xl">
              Unit {user?.unitNumber || 'A-302'}, {user?.building || 'Block A'} • Zone water pressure is nominal at 2.4 bar.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/submit-complaint"
              className="px-5 py-2.5 bg-white text-sky-700 hover:bg-cyan-50 font-bold text-xs rounded-xl shadow transition transform hover:-translate-y-0.5 flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Water Issue</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards (from specifications) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Today's Consumption */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Usage</span>
            <div className="p-2 rounded-xl bg-cyan-50 text-cyan-600">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">245 L</p>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-semibold space-x-1">
            <span>↓ 4.5% vs yesterday</span>
          </div>
        </div>

        {/* Card 2: Monthly Consumption */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Monthly Usage</span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">6,420 L</p>
          <div className="mt-2 flex items-center text-[11px] text-amber-600 font-semibold space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>8% higher than last month</span>
          </div>
        </div>

        {/* Card 3: Water Availability */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Water Availability</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">
            {availability?.availablePercentage || 72}%
          </p>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 font-semibold">
            <span>{availability?.estimatedRemainingDays || 1.8} Days storage buffer</span>
          </div>
        </div>

        {/* Card 4: Open Complaints */}
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Complaints</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-3">
            {openComplaintsCount}
          </p>
          <div className="mt-2 flex items-center text-[11px] text-sky-600 font-semibold">
            <Link to="/complaints" className="hover:underline flex items-center space-x-1">
              <span>View status timeline</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* AI Recommendation Alert Card */}
      <div className="bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 border border-sky-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start space-x-3.5">
          <div className="p-2.5 rounded-xl bg-sky-500 text-white shadow-md shadow-sky-500/30 flex-shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">AI Conservation Insight</span>
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">Elevated Usage Alert</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
              “Your water consumption increased by 12% this week. Check for unusually high usage or possible faucet/aerator leakage in Unit {user?.unitNumber || 'A-302'}.”
            </p>
          </div>
        </div>
        <Link
          to="/recommendations"
          className="flex-shrink-0 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow transition whitespace-nowrap"
        >
          Explore AI Tips
        </Link>
      </div>

      {/* Consumption Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Personal Water Consumption Telemetry</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time meter readings & hourly usage variance</p>
          </div>

          {/* Time Filter Buttons */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['today', '7days', '30days'].map((r) => (
              <button
                key={r}
                onClick={() => setChartRange(r)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  chartRange === r ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7days' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={consumptionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="waterFlowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" unit=" L" />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#bae6fd', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                formatter={(val) => [`${val} Litres`, 'Consumption']}
              />
              <Area type="monotone" dataKey="litres" stroke="#0284c7" strokeWidth={2.5} fill="url(#waterFlowGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Complaints & Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">My Water Complaints & Timeline</h3>
            <p className="text-xs text-slate-500 mt-0.5">Live status and maintenance dispatch tracking</p>
          </div>
          <Link to="/submit-complaint" className="text-xs font-bold text-sky-600 hover:underline">
            + File New Complaint
          </Link>
        </div>

        {complaints.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            No active water issues lodged. Everything is flowing smoothly!
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.slice(0, 4).map((c) => (
              <div key={c._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{c.complaintId}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      c.priority === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700'
                        : c.priority === 'HIGH'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-cyan-100 text-cyan-800'
                    }`}>
                      {c.priority}
                    </span>
                    <span className="text-xs text-slate-500">• {c.category}</span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-800">{c.title}</h4>
                  <p className="text-[11px] text-slate-500">{c.location}</p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl flex items-center space-x-1 ${
                    c.status === 'Resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'In Progress'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.status === 'Resolved' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    <span>{c.status}</span>
                  </span>
                  <Link
                    to={`/complaints`}
                    className="p-1.5 text-slate-400 hover:text-sky-600 rounded-lg transition"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResidentDashboard;
