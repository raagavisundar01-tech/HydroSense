import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileQuestion,
  AlertTriangle,
  Upload,
  MapPin,
  Building,
  CheckCircle,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import axios from 'axios';

export const SubmitComplaintPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Pipeline Leakage',
    description: '',
    location: '',
    building: user?.building || 'Block A',
    zone: user?.zone || 'North Zone',
    images: []
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState(null);

  // Dynamic priority calculation preview
  const previewPriority = () => {
    const text = `${formData.title} ${formData.description}`.toLowerCase();
    const critical = ['burst', 'gushing', 'flood', 'flooding', 'major leak', 'emergency', 'collapsed'];
    const high = ['overflow', 'no water', 'contamination', 'black water', 'smell', 'pressure zero', 'damaged'];

    if (critical.some(k => text.includes(k)) || formData.category === 'Pipeline Leakage') return 'CRITICAL';
    if (high.some(k => text.includes(k)) || formData.category === 'Tank Overflow' || formData.category === 'No Water Supply') return 'HIGH';
    if (formData.category === 'Low Water Pressure' || formData.category === 'Water Quality Issue') return 'MEDIUM';
    return 'LOW';
  };

  const calculatedPriority = previewPriority();

  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageUrlInput.trim()]
      });
      setImageUrlInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/api/complaints', formData);
      setSuccessTicket(res.data.complaint);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-sky-600 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      {successTicket ? (
        <div className="bg-white p-8 rounded-3xl border border-sky-100 shadow-xl text-center space-y-5 animate-pop-in">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900">
            Complaint Registered Successfully!
          </h2>
          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 max-w-sm mx-auto">
            <p className="text-xs text-slate-500">Unique Tracking ID</p>
            <p className="text-xl font-extrabold font-mono text-sky-700 mt-1">
              {successTicket.complaintId}
            </p>
            <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-700">
              <span>Priority: {successTicket.priority}</span>
            </div>
          </div>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            HydroSense AI categorized your issue and notified maintenance staff. You will receive live status updates in your notification center.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/complaints')}
              className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-600 text-white font-bold text-xs rounded-xl shadow transition"
            >
              Track Ticket Timeline
            </button>
            <button
              onClick={() => {
                setSuccessTicket(null);
                setFormData({
                  title: '',
                  category: 'Pipeline Leakage',
                  description: '',
                  location: '',
                  building: user?.building || 'Block A',
                  zone: user?.zone || 'North Zone',
                  images: []
                });
              }}
              className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 transition"
            >
              Report Another Issue
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-sky-100 shadow-xl space-y-6">
          <div>
            <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
              <FileQuestion className="w-4 h-4" />
              <span>Smart Issue Reporting</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Submit Water Complaint
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Our AI engine automatically evaluates priority based on category, damage risk, and area impact.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Complaint Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="Pipeline Leakage">Pipeline Leakage</option>
                <option value="Tank Overflow">Tank Overflow</option>
                <option value="No Water Supply">No Water Supply</option>
                <option value="Low Water Pressure">Low Water Pressure</option>
                <option value="Water Quality Issue">Water Quality Issue</option>
                <option value="Damaged Pipeline">Damaged Pipeline</option>
                <option value="Water Wastage">Water Wastage</option>
                <option value="Drainage Issue">Drainage Issue</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Continuous Gushing from Floor 2 Fire Riser Box"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what is happening, approximate water loss rate, and whether electrical or flooring hazard is present..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:outline-none leading-relaxed"
              />
            </div>

            {/* AI Automated Priority Badge Live Preview */}
            <div className="p-3.5 bg-gradient-to-r from-sky-50 to-cyan-50 rounded-2xl border border-sky-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-sky-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span className="text-xs font-bold text-slate-800">AI Priority Classifier Preview:</span>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                calculatedPriority === 'CRITICAL'
                  ? 'bg-rose-100 text-rose-700 border border-rose-300'
                  : calculatedPriority === 'HIGH'
                  ? 'bg-amber-100 text-amber-700 border border-amber-300'
                  : 'bg-cyan-100 text-cyan-800 border border-cyan-300'
              }`}>
                {calculatedPriority} PRIORITY
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Building</label>
                <select
                  value={formData.building}
                  onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Block A">Block A - Lotus Wing</option>
                  <option value="Block B">Block B - Emerald Wing</option>
                  <option value="Block C">Block C - Sapphire Wing</option>
                  <option value="Block D">Block D - Coral Wing</option>
                  <option value="Block E">Block E - Crystal Wing</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Zone</label>
                <input
                  type="text"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g. Staircase B Floor 2"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Photo Attachment URL Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Attach Photo Evidence (URL or Demo Mock)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/... or paste image link"
                  className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-700 text-xs font-bold rounded-xl transition"
                >
                  Add Image
                </button>
              </div>

              {formData.images.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto py-1">
                  {formData.images.map((img, i) => (
                    <img key={i} src={img} alt="attachment" className="w-16 h-16 rounded-xl object-cover border border-slate-200" />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-500/25 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Register Complaint'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubmitComplaintPage;
