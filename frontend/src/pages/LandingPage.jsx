import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets,
  Activity,
  TrendingUp,
  ClipboardCheck,
  BarChart2,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Building,
  Layers
} from 'lucide-react';
import { DroppyCartoonSVG } from '../components/WaterMascotNotification';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-cyan-500 selection:text-white">
      {/* Hero Section with Water Ambient Glow */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 bg-gradient-to-b from-sky-100/70 via-cyan-50/40 to-slate-50">
        {/* Decorative Water Bubbles */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-cyan-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Tagline Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-cyan-100/80 border border-cyan-200 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-6 animate-pulse">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Smarter Water. Better Future.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
              AI-Powered Smart Water{' '}
              <span className="bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                Management Platform
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              “Monitor water consumption, detect potential leaks, predict future demand, and manage water-related complaints through one intelligent platform.”
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-base shadow-lg shadow-sky-500/25 transition transform hover:-translate-y-0.5 active:translate-y-0 text-center"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-200 shadow-sm transition text-center"
              >
                Login to Portal
              </Link>
              <Link
                to="/resident/dashboard"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-base border border-cyan-200 transition text-center flex items-center justify-center space-x-2"
              >
                <span>Explore Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Cartoon Mascot Cameo in Hero */}
            <div className="mt-8 flex items-center justify-center space-x-3 text-xs text-slate-500">
              <DroppyCartoonSVG mood="happy" size={36} />
              <span>Protected 24/7 by Droppy & HydroSense Isolation Forest ML Models</span>
            </div>
          </div>

          {/* Interactive Dashboard Preview Card */}
          <div className="mt-16 relative max-w-5xl mx-auto rounded-3xl p-3 bg-gradient-to-b from-sky-200 to-cyan-100 shadow-2xl border border-white">
            <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-inner overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs text-slate-400 font-mono ml-2">HydroSense Command Center – Live Telemetry</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Real-time Ingestion</span>
                </span>
              </div>

              {/* Mock Dashboard Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400">Total Consumption</p>
                  <p className="text-2xl font-extrabold text-cyan-400 mt-1">25,480 L</p>
                  <p className="text-[10px] text-emerald-400 mt-1">↓ 3.2% vs yesterday</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
                  <p className="text-xs text-slate-400">Water Availability</p>
                  <p className="text-2xl font-extrabold text-sky-400 mt-1">72.8%</p>
                  <p className="text-[10px] text-slate-400 mt-1">1.8 Days remaining</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-rose-500/40">
                  <p className="text-xs text-rose-300">AI Leak Detection</p>
                  <p className="text-2xl font-extrabold text-rose-400 mt-1">91% Risk</p>
                  <p className="text-[10px] text-rose-300 mt-1">Block C – Floor 2 Anomaly</p>
                </div>
                <div className="bg-slate-800/80 p-4 rounded-xl border border-amber-500/40">
                  <p className="text-xs text-amber-300">Predicted Demand</p>
                  <p className="text-2xl font-extrabold text-amber-400 mt-1">18,500 L</p>
                  <p className="text-[10px] text-amber-300 mt-1">Expected Shortage: 4,300 L</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-sky-600">25K+ L</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Litres Monitored Daily</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-cyan-600">98%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Leak Detection Accuracy</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600">32</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Active Monitored Zones</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-600">450+</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wide">Water Issues Resolved</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Intelligence Suite</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Integrated Water Management Modules
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              Combining full-stack engineering, scikit-learn anomaly detection, and predictive demand algorithms into one connected platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-7 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-5">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">AI Leak Detection</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Isolation Forest algorithm flags abnormal consumption (e.g. 480 L/hr vs 145 L/hr baseline) and generates automated maintenance alerts.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-rose-600">
                <span>91% Leak Probability Detection</span>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-7 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Demand Forecasting</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Predicts future water requirements based on occupancy, season, day of week, and weather data to prevent critical shortages.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-sky-600">
                <span>Next-Day & 7-Day Forecasting</span>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-7 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-5">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Smart Complaint System</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Automatic ticket prioritization (Critical, High, Medium, Low), staff dispatching, timeline tracking, and resolution proof uploads.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-cyan-700">
                <span>End-to-End Resolution Tracking</span>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-7 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Consumption Analytics</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Granular hourly, daily, and monthly breakdown with peak hour analysis, lowest flow, and week-over-week deviation metrics.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                <span>Time-of-Day Pattern Insights</span>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-7 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-5">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Storage & Shortage Defense</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Monitors capacity across campus tanks, remaining days buffer, and automatically warns admins when storage drops below safety margin.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600">
                <span>Multi-Tank Level Telemetry</span>
              </div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-7 rounded-2xl border border-sky-100 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Intelligent Mascot & Alerts</h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                In-app notification system powered by Droppy the animated water droplet cartoon mascot with sound chimes and instant notifications.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-600">
                <span>Role-Based Smart Notifications</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Flow */}
      <section id="how-it-works" className="py-20 bg-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Workflow</span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              How HydroSense Operates
            </h2>
            <p className="text-slate-600 text-sm mt-3">
              A closed-loop pipeline ensuring early detection, automated prioritization, and preventive resolution.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
            {[
              { step: '01', title: 'Monitor', desc: 'Meter sensors capture continuous flow data' },
              { step: '02', title: 'Analyze', desc: 'Baseline models calculate expected usage' },
              { step: '03', title: 'Detect', desc: 'Isolation Forest flags pipe anomalies' },
              { step: '04', title: 'Predict', desc: 'Random Forest projects tomorrow demand' },
              { step: '05', title: 'Alert', desc: 'Droppy notifies admin & resident' },
              { step: '06', title: 'Resolve', desc: 'Maintenance crew resolves root cause' }
            ].map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 relative">
                <span className="text-xs font-extrabold text-sky-500 font-mono">{s.step}</span>
                <h4 className="text-base font-bold text-slate-900 mt-1">{s.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-sky-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-sky-600 uppercase tracking-widest">Impact & Value</span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Real-World Sustainability for Modern Communities
              </h2>
              <p className="text-slate-600 text-sm mt-4 leading-relaxed">
                Whether deployed in a university campus, apartment complex, or municipal water utility, HydroSense replaces guesswork with data-driven predictive precision.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Reduce water wastage by up to 28% through prompt leak intervention',
                  'Detect pinhole leaks before catastrophic structural damage occurs',
                  'Predict water requirements accurately to eliminate surprise shortages',
                  'Streamline maintenance dispatch with automated priority ranking',
                  'Empower residents with personalized water-saving recommendations',
                  'Export comprehensive audit reports for municipal and green certifications'
                ].map((b, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-slate-700">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Droppy Animation Mascot Callout Box */}
            <div className="bg-white p-8 rounded-3xl border border-sky-200 shadow-xl relative overflow-hidden flex flex-col items-center text-center">
              <div className="w-32 h-32 mb-4">
                <DroppyCartoonSVG mood="happy" size={110} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Meet Droppy</h3>
              <p className="text-xs text-slate-600 max-w-sm mt-2 leading-relaxed">
                HydroSense’s friendly AI Mascot keeps residents and maintenance staff engaged with animated cartoon popups, water-saving nudges, and urgent leak warnings.
              </p>
              <div className="mt-6 flex gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Experience Platform
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
