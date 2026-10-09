import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  Zap,
  Sliders,
  Send,
  Building,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

export const AILeakDetectionPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live ML Simulator Form Inputs
  const [simBuilding, setSimBuilding] = useState('Block C');
  const [simZone, setSimZone] = useState('East Zone');
  const [simConsumption, setSimConsumption] = useState(480);
  const [simBaseline, setSimBaseline] = useState(145);
  const [simFlowRate, setSimFlowRate] = useState(42);
  const [testResult, setTestResult] = useState(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    fetchAlerts();
    runInitialCheck();
  }, []);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/ai/leak-alerts');
      setAlerts(res.data.alerts || []);
    } catch (e) {
      console.warn('Error fetching alerts:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const runInitialCheck = async () => {
    runLeakTest(480, 145, 42, 'Block C', 'East Zone');
  };

  const runLeakTest = async (cons, base, flow, bld, zn) => {
    try {
      setEvaluating(true);
      const res = await axios.post('/api/ai/leak-check', {
        consumption: cons !== undefined ? cons : simConsumption,
        normal_average: base !== undefined ? base : simBaseline,
        flow_rate: flow !== undefined ? flow : simFlowRate,
        building: bld || simBuilding,
        zone: zn || simZone
      });
      setTestResult(res.data);
    } catch (e) {
      console.warn('Leak check error:', e.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleSimulateAndRecord = async () => {
    try {
      setEvaluating(true);
      const res = await axios.post('/api/water/simulate-reading', {
        building: simBuilding,
        zone: simZone,
        consumption: simConsumption,
        normalAverage: simBaseline,
        forceLeak: true
      });
      setTestResult(res.data.aiAnalysis);
      fetchAlerts();
    } catch (e) {
      alert(e.response?.data?.message || 'Simulation error');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Activity className="w-4 h-4" />
          <span>Scikit-Learn Isolation Forest Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          AI Water Leak & Anomaly Detection
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Analyzes real-time consumption telemetry and historical diurnal baselines to flag physical pipeline leaks.
        </p>
      </div>

      {/* Interactive Live ML Tester / Simulator */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Interactive Isolation Forest Inference Simulator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate sensor spikes to test AI anomaly detection and automated alert dispatch
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSimConsumption(480);
                setSimBaseline(145);
                setSimFlowRate(42);
                setSimBuilding('Block C');
                runLeakTest(480, 145, 42, 'Block C', 'East Zone');
              }}
              className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl text-xs font-bold transition border border-rose-200"
            >
              Load Example: 480 L/hr Burst
            </button>
            <button
              onClick={() => {
                setSimConsumption(140);
                setSimBaseline(145);
                setSimFlowRate(12);
                setSimBuilding('Block A');
                runLeakTest(140, 145, 12, 'Block A', 'North Zone');
              }}
              className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl text-xs font-bold transition border border-emerald-200"
            >
              Load Normal Flow
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span>Current Water Flow (L/hr):</span>
                <span className="font-mono text-sky-700">{simConsumption} L/hr</span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                value={simConsumption}
                onChange={(e) => {
                  setSimConsumption(Number(e.target.value));
                  runLeakTest(Number(e.target.value), simBaseline, simFlowRate, simBuilding, simZone);
                }}
                className="w-full accent-sky-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Normal Baseline (L/hr)</label>
                <input
                  type="number"
                  value={simBaseline}
                  onChange={(e) => {
                    setSimBaseline(Number(e.target.value));
                    runLeakTest(simConsumption, Number(e.target.value), simFlowRate, simBuilding, simZone);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Flow Rate (L/min)</label>
                <input
                  type="number"
                  value={simFlowRate}
                  onChange={(e) => {
                    setSimFlowRate(Number(e.target.value));
                    runLeakTest(simConsumption, simBaseline, Number(e.target.value), simBuilding, simZone);
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Building</label>
                <select
                  value={simBuilding}
                  onChange={(e) => setSimBuilding(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none"
                >
                  <option value="Block A">Block A</option>
                  <option value="Block B">Block B</option>
                  <option value="Block C">Block C</option>
                  <option value="Block D">Block D</option>
                  <option value="Block E">Block E</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Zone</label>
                <input
                  type="text"
                  value={simZone}
                  onChange={(e) => setSimZone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleSimulateAndRecord}
              disabled={evaluating}
              className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow transition"
            >
              {evaluating ? 'Analyzing ML Vector...' : 'Ingest Sensor Data & Trigger Live AI Alert'}
            </button>
          </div>

          {/* AI Result Card (Exact Specification Layout) */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-inner relative overflow-hidden flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono text-cyan-400">MODEL: ISOLATION_FOREST_V1</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  testResult?.anomaly
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {testResult?.anomaly ? 'ABNORMAL / POSSIBLE LEAK' : 'NORMAL PATTERN'}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400">Location:</p>
                <p className="text-sm font-bold text-slate-200 mt-0.5">
                  {testResult?.building || simBuilding} – {testResult?.zone || simZone}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400">Current Usage:</p>
                  <p className="text-lg font-extrabold text-cyan-400">{testResult?.current_usage || simConsumption} L/hr</p>
                </div>
                <div>
                  <p className="text-slate-400">Normal Usage:</p>
                  <p className="text-lg font-extrabold text-slate-300">{testResult?.normal_usage || simBaseline} L/hr</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs pt-1 border-t border-slate-800">
                <div>
                  <p className="text-slate-400">Leak Probability:</p>
                  <p className={`text-xl font-extrabold ${
                    (testResult?.leak_probability || 0) > 0.7 ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {Math.round((testResult?.leak_probability || 0.1) * 100)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-400">Severity Level:</p>
                  <p className={`text-xl font-extrabold ${
                    testResult?.severity === 'CRITICAL' || testResult?.severity === 'HIGH'
                      ? 'text-rose-400'
                      : 'text-emerald-400'
                  }`}>
                    {testResult?.severity || 'NORMAL'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Recommended Action:</p>
              <p className="text-xs text-cyan-200 mt-1 font-medium leading-relaxed">
                {testResult?.recommended_action || 'Inspect water pipeline immediately.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active AI Leak Maintenance Alerts Table */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            AI-Generated Maintenance Alerts
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Automatic alarms created when anomaly score exceeds safety thresholds
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {alerts.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No active leak alerts detected. All zone baselines are steady.
            </div>
          ) : (
            alerts.map((a) => (
              <div key={a._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      a.severity === 'CRITICAL' || a.severity === 'HIGH'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {a.severity}
                    </span>
                    <span className="font-bold text-xs text-slate-900">{a.location}</span>
                    <span className="text-xs text-slate-400">• {a.building}</span>
                  </div>
                  <p className="text-xs text-slate-700">
                    Flow: <span className="font-bold text-rose-600">{a.consumption} L/hr</span> (Baseline: {a.normalAverage} L/hr) • Leak Probability: <span className="font-bold text-slate-900">{Math.round(a.leakProbability * 100)}%</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    💡 Action: {a.recommendedAction}
                  </p>
                </div>

                <div className="flex items-center space-x-3 self-end sm:self-center">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${
                    a.status === 'Active' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {a.status}
                  </span>
                  {a.assignedStaffName && (
                    <span className="text-xs text-slate-500">
                      Assigned: {a.assignedStaffName}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AILeakDetectionPage;
