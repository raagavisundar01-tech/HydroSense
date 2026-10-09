import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MapPin,
  ClipboardList,
  Upload,
  Camera,
  Check,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import axios from 'axios';

export const MaintenanceStaffDashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [leakAlerts, setLeakAlerts] = useState([]);
  const [activeTask, setActiveTask] = useState(null);
  const [notes, setNotes] = useState('');
  const [resolutionImg, setResolutionImg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaffData();
  }, [user]);

  const fetchStaffData = async () => {
    try {
      setLoading(true);
      const [compRes, leakRes] = await Promise.all([
        axios.get('/api/complaints'),
        axios.get('/api/ai/leak-alerts')
      ]);

      setTasks(compRes.data.complaints || []);
      setLeakAlerts(leakRes.data.alerts || []);
    } catch (e) {
      console.warn('Error fetching staff data:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await axios.put(`/api/complaints/${taskId}/status`, {
        status: newStatus,
        notes: notes || `Work updated to ${newStatus}`,
        resolutionImage: resolutionImg
      });
      fetchStaffData();
      setActiveTask(null);
      setNotes('');
      setResolutionImg('');
    } catch (e) {
      alert(e.response?.data?.message || 'Error updating task');
    }
  };

  const assignedCount = tasks.filter((t) => t.status !== 'Resolved' && t.status !== 'Closed').length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'CRITICAL' || t.priority === 'HIGH').length;
  const activeLeaksCount = leakAlerts.filter((l) => l.status === 'Active').length;
  const completedCount = tasks.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600 via-sky-600 to-cyan-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-amber-200 text-xs font-bold uppercase tracking-wider">
              Field Maintenance Dispatch
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold mt-1">
              Technician Workspace: {user?.name || 'Rajesh Kumar'}
            </h1>
            <p className="text-amber-100 text-xs sm:text-sm mt-0.5">
              Assigned Coverage: {user?.zone || 'Zone 1 & 2'} • Active Field Duty
            </p>
          </div>
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold uppercase">Online & Dispatched</span>
          </div>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-slate-400 uppercase">Assigned Tasks</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{assignedCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">Active plumbing jobs</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-rose-500 uppercase">High Priority</p>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">{highPriorityCount}</p>
          <p className="text-[11px] text-rose-500 mt-1">Requires immediate visit</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-amber-500 uppercase">AI Leak Alerts</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{activeLeaksCount}</p>
          <p className="text-[11px] text-amber-500 mt-1">Telemetry anomalies</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-sky-100 shadow-sm water-card">
          <p className="text-xs font-semibold text-emerald-600 uppercase">Completed Work</p>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{completedCount}</p>
          <p className="text-[11px] text-emerald-600 mt-1">Resolved & closed</p>
        </div>
      </div>

      {/* Assigned Tasks Workboard */}
      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Assigned Maintenance Tasks</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any task to update progress or upload resolution proof</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {tasks.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No tasks currently assigned. Great job!
            </div>
          ) : (
            tasks.map((t) => (
              <div key={t._id} className="py-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {t.complaintId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      t.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {t.priority}
                    </span>
                    <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                      {t.category}
                    </span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-xl self-start sm:self-auto ${
                    t.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-sky-100 text-sky-800'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{t.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    📍 {t.location} ({t.building}) • Reported by: {t.userName || 'Resident'}
                  </p>
                </div>

                {/* Inline Quick Action Controls */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {t.status !== 'In Progress' && t.status !== 'Resolved' && (
                    <button
                      onClick={() => handleUpdateStatus(t._id, 'In Progress')}
                      className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      Start Work (In Progress)
                    </button>
                  )}

                  {t.status === 'In Progress' && (
                    <button
                      onClick={() => setActiveTask(t)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
                    >
                      Mark Resolved & Upload Proof
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTask(t)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                  >
                    Add Work Notes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for adding notes or uploading resolution proof */}
      {activeTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-pop-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-sky-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update Task: {activeTask.complaintId}
            </h3>
            <p className="text-xs text-slate-500">
              {activeTask.title} – {activeTask.location}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Technician Work Notes & Parts Used
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Replaced 2-inch gate valve with brass ball valve; tested line pressure at 2.4 bar with zero seepage."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resolution Image URL (or Demonstration Link)
              </label>
              <input
                type="url"
                value={resolutionImg}
                onChange={(e) => setResolutionImg(e.target.value)}
                placeholder="https://images.unsplash.com/... or paste image link"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveTask(null)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(activeTask._id, 'Resolved')}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Complete & Mark Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceStaffDashboard;
