import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  ChevronRight,
  Filter,
  Eye,
  PlusCircle,
  X,
  MessageSquare,
  Wrench
} from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const ComplaintsListPage = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Status update form states
  const [newStatus, setNewStatus] = useState('In Progress');
  const [workNotes, setWorkNotes] = useState('');
  const [resolutionImg, setResolutionImg] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('');

  useEffect(() => {
    fetchComplaints();
    if (user?.role === 'admin') fetchStaff();
  }, [user]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/complaints');
      setComplaints(res.data.complaints || []);
    } catch (err) {
      console.warn('Error fetching complaints:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await axios.get('/api/admin/staff');
      setStaffList(res.data.staff || []);
    } catch (e) {}
  };

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    try {
      await axios.put(`/api/complaints/${selectedComplaint._id}/status`, {
        status: newStatus,
        notes: workNotes,
        resolutionImage: resolutionImg
      });
      fetchComplaints();
      setSelectedComplaint(null);
      setWorkNotes('');
      setResolutionImg('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAssignStaff = async () => {
    if (!selectedComplaint || !selectedStaffId) return;
    try {
      await axios.put(`/api/complaints/${selectedComplaint._id}/assign`, {
        staffId: selectedStaffId
      });
      fetchComplaints();
      setSelectedComplaint(null);
      setSelectedStaffId('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign staff');
    }
  };

  // Filter complaints
  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ClipboardList className="w-4 h-4" />
            <span>Water Ticket Management</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            {user?.role === 'resident'
              ? 'My Water Complaints'
              : user?.role === 'staff'
              ? 'Assigned Maintenance Tasks'
              : 'All Campus Complaints'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            End-to-end lifecycle monitoring with automated AI prioritization and timeline audits.
          </p>
        </div>

        {user?.role === 'resident' && (
          <Link
            to="/submit-complaint"
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow transition flex items-center space-x-2 self-start"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Report Water Problem</span>
          </Link>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Status:</span>
          {['ALL', 'Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === s
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Complaints List Table / Cards */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-slate-400 text-xs">Loading complaints...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            No complaints match the current filter criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="p-5 hover:bg-sky-50/40 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {c.complaintId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        c.priority === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-700 border border-rose-200'
                          : c.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-700 border border-amber-200'
                          : 'bg-cyan-100 text-cyan-800 border border-cyan-200'
                      }`}
                    >
                      {c.priority} Priority
                    </span>
                    <span className="text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full">
                      {c.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-600 max-w-2xl line-clamp-2">
                    {c.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>📍 {c.location} ({c.building})</span>
                    <span>👤 Reported by: {c.userName || 'Resident'}</span>
                    {c.assignedStaffName && (
                      <span className="text-sky-600 font-semibold">
                        🔧 Staff: {c.assignedStaffName}
                      </span>
                    )}
                    <span>⏱ {new Date(c.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 self-end md:self-center flex-shrink-0">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-xl flex items-center space-x-1.5 ${
                      c.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : c.status === 'In Progress'
                        ? 'bg-sky-100 text-sky-800'
                        : c.status === 'Assigned'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.status === 'Resolved' ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{c.status}</span>
                  </span>

                  <button
                    onClick={() => setSelectedComplaint(c)}
                    className="px-3.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-xs rounded-xl transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Timeline & Action</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Complaint Detail & Timeline Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-pop-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-sky-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                    {selectedComplaint.complaintId}
                  </span>
                  <span className="text-xs font-bold uppercase text-slate-500">
                    {selectedComplaint.category}
                  </span>
                </div>
                <h2 className="text-lg font-extrabold text-slate-900 mt-1">
                  {selectedComplaint.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Location: {selectedComplaint.location} • {selectedComplaint.building}
                </p>
              </div>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Resident Report Description
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {selectedComplaint.description}
              </p>
              {selectedComplaint.images?.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {selectedComplaint.images.map((img, i) => (
                    <img key={i} src={img} alt="proof" className="w-20 h-20 rounded-xl object-cover border border-slate-200" />
                  ))}
                </div>
              )}
            </div>

            {/* Lifecycle Timeline */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
                Ticket Lifecycle Timeline
              </h4>
              <div className="relative pl-6 space-y-4 border-l-2 border-sky-200">
                {(selectedComplaint.timeline || []).map((t, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-sky-500 border-2 border-white ring-2 ring-sky-200" />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{t.status}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(t.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">{t.message}</p>
                    <span className="text-[10px] text-slate-400">By: {t.updatedBy}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Action: Assign Staff */}
            {user?.role === 'admin' && (
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-purple-900">
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Assign Maintenance Staff Member</span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="flex-1 px-3 py-2 bg-white border border-purple-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="">Select staff technician...</option>
                    {staffList.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.zone || 'Maintenance'}) – {s.phone || 'Available'}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignStaff}
                    disabled={!selectedStaffId}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
                  >
                    Assign
                  </button>
                </div>
              </div>
            )}

            {/* Staff / Admin Action: Update Status & Resolution */}
            {(user?.role === 'staff' || user?.role === 'admin') && (
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-sky-900">
                  <Wrench className="w-4 h-4 text-sky-600" />
                  <span>Update Work Status & Resolution Notes</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Assigned">Assigned</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                  <input
                    type="url"
                    value={resolutionImg}
                    onChange={(e) => setResolutionImg(e.target.value)}
                    placeholder="Resolution Photo URL (optional)"
                    className="px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
                <textarea
                  rows={2}
                  value={workNotes}
                  onChange={(e) => setWorkNotes(e.target.value)}
                  placeholder="Enter repair notes, parts replaced (e.g. replaced brass gate valve)..."
                  className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs focus:outline-none"
                />
                <button
                  onClick={handleUpdateStatus}
                  className="w-full py-2.5 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Save Status & Post Work Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsListPage;
