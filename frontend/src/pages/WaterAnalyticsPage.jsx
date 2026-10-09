import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Droplets,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Zap,
  Layers
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

export const WaterAnalyticsPage = () => {
  const [range, setRange] = useState('7days');
  const [selectedBuilding, setSelectedBuilding] = useState('All');
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [chartType, setChartType] = useState('area');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [range, selectedBuilding]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [anaRes, conRes] = await Promise.all([
        axios.get(`/api/water/analytics?building=${selectedBuilding}`),
        axios.get(`/api/water/consumption?range=${range}&building=${selectedBuilding}`)
      ]);

      setAnalytics(anaRes.data);

      const formatted = (conRes.data.data || []).slice(-16).map((d) => ({
        timestamp: new Date(d.timestamp).toLocaleDateString([], {
          weekday: range === '7days' ? 'short' : undefined,
          month: 'short',
          day: 'numeric',
          hour: range === 'today' ? '2-digit' : undefined
        }),
        consumption: d.consumption,
        flowRate: d.flowRate,
        building: d.building
      }));
      setChartData(formatted);
    } catch (e) {
      console.warn('Analytics fetch error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const summary = analytics?.summary || {
    totalConsumption: 25480,
    avgConsumption: 184,
    peakConsumption: 480,
    lowestConsumption: 42,
    deviationPercent: 12.4,
    weekOverWeekChange: 8.2,
    monthOverMonthChange: -3.5
  };

  const timeOfDay = analytics?.timeOfDay || {
    morning: { label: 'Morning (06:00 - 12:00)', level: 'HIGH' },
    afternoon: { label: 'Afternoon (12:00 - 17:00)', level: 'MEDIUM' },
    evening: { label: 'Evening (17:00 - 22:00)', level: 'HIGH' },
    night: { label: 'Night (22:00 - 06:00)', level: 'LOW' }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Water Consumption Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Water Consumption Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Temporal breakdown, time-of-day peak usage patterns, and anomaly deviations.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-3.5 py-2 bg-white border border-sky-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="All">All Campus Wings</option>
            <option value="Block A">Block A (Lotus)</option>
            <option value="Block B">Block B (Emerald)</option>
            <option value="Block C">Block C (Sapphire)</option>
            <option value="Block D">Block D (Coral)</option>
            <option value="Block E">Block E (Crystal)</option>
          </select>

          <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            {['today', '7days', '30days', 'year'].map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg transition capitalize ${
                  range === r ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'today' ? 'Today' : r === '7days' ? '7 Days' : r === '30days' ? '30 Days' : '1 Year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Average Flow</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{summary.avgConsumption} L/hr</p>
          <div className="mt-2 flex items-center text-[11px] text-slate-500 font-semibold">
            <span>Nominal campus baseline</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Peak Consumption</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{summary.peakConsumption} L/hr</p>
          <div className="mt-2 flex items-center text-[11px] text-rose-600 font-semibold space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Recorded at 08:30 AM</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Lowest Usage</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{summary.lowestConsumption} L/hr</p>
          <div className="mt-2 flex items-center text-[11px] text-emerald-600 font-semibold">
            <span>Recorded at 03:15 AM</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Week-Over-Week</p>
          <p className="text-3xl font-extrabold text-sky-700 mt-2">+{summary.weekOverWeekChange}%</p>
          <div className="mt-2 flex items-center text-[11px] text-amber-600 font-semibold space-x-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Usage deviation: {summary.deviationPercent}%</span>
          </div>
        </div>
      </div>

      {/* Main Graph Card with Chart Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Consumption Trend Profile ({selectedBuilding})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Litres consumed across selected observation period
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                chartType === 'area' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Area Flow
            </button>
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                chartType === 'bar' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Bar Columns
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                chartType === 'line' ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Line Trend
            </button>
          </div>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" unit=" L" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#bae6fd' }}
                  formatter={(v) => [`${v} Litres`, 'Consumption']}
                />
                <Bar dataKey="consumption" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" unit=" L" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#bae6fd' }}
                  formatter={(v) => [`${v} Litres`, 'Consumption']}
                />
                <Line type="monotone" dataKey="consumption" stroke="#0284c7" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="analyticsWaterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="timestamp" tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} stroke="#cbd5e1" unit=" L" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', borderColor: '#bae6fd' }}
                  formatter={(v) => [`${v} Litres`, 'Consumption']}
                />
                <Area type="monotone" dataKey="consumption" stroke="#0284c7" strokeWidth={3} fill="url(#analyticsWaterGrad)" />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Consumption Pattern Analysis by Time of Day (Specified in requirements) */}
      <div className="bg-white p-6 rounded-2xl border border-sky-100 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Temporal Consumption Pattern Analysis
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Diurnal distribution across daily lifestyle routines
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800">Morning Routine</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-200 text-rose-800">
                HIGH
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">06:00 AM – 12:00 PM</p>
            <p className="text-[11px] text-slate-500 mt-1">Showers, cooking & garden irrigation peak period.</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">Afternoon Lull</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-800">
                MEDIUM
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">12:00 PM – 05:00 PM</p>
            <p className="text-[11px] text-slate-500 mt-1">Moderate residential occupancy & commercial usage.</p>
          </div>

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800">Evening Peak</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-200 text-sky-800">
                HIGH
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">05:00 PM – 10:00 PM</p>
            <p className="text-[11px] text-slate-500 mt-1">Return from campus/work, appliances & dining prep.</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Nocturnal Baseline</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                LOW
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-2 font-medium">10:00 PM – 06:00 AM</p>
            <p className="text-[11px] text-slate-500 mt-1">Expected minimal flow. High flow here indicates pipe leaks!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterAnalyticsPage;
