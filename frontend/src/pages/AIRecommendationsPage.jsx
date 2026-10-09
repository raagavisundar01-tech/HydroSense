import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Lightbulb,
  Sparkles,
  Droplets,
  CheckCircle,
  TrendingDown,
  Zap,
  ArrowRight
} from 'lucide-react';
import { DroppyCartoonSVG } from '../components/WaterMascotNotification';
import axios from 'axios';

export const AIRecommendationsPage = () => {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecs();
  }, [user]);

  const fetchRecs = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/ai/recommendations');
      setRecommendations(res.data.recommendations || []);
    } catch (e) {
      console.warn('Recs load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Dynamic Optimization Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          AI Recommendations & Insights
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Intelligent nudges and data-driven conservation tips tailored to current consumption patterns.
        </p>
      </div>

      {/* Mascot Hero Card */}
      <div className="bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="flex-shrink-0">
          <DroppyCartoonSVG mood="happy" size={96} />
        </div>
        <div className="space-y-2 text-center sm:text-left">
          <span className="text-cyan-100 text-xs font-extrabold uppercase tracking-widest">
            Droppy’s Smart Advice
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold">
            “Water saved today is resilience secured for tomorrow!”
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100 max-w-xl leading-relaxed">
            Our machine-learning models observe peak drawing times and notify you when small habit adjustments can shave off hundreds of litres every week.
          </p>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recommendations.map((r) => (
          <div
            key={r.id}
            className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm water-card flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase bg-sky-50 text-sky-700 border border-sky-200">
                  {r.badge}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold">{r.category}</span>
              </div>

              <h3 className="text-base font-bold text-slate-900 leading-snug">
                {r.title}
              </h3>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {r.text}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-cyan-700">
              <span>{r.impact}</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendationsPage;
