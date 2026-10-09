import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, User, Mail, Lock, Building, MapPin, Phone, AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'resident',
    building: 'Block A',
    zone: 'North Zone',
    unitNumber: 'A-101',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await register(formData);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'staff') navigate('/staff/dashboard');
      else navigate('/resident/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 via-cyan-50/30 to-slate-50">
      <div className="max-w-lg w-full bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-sky-100 shadow-xl space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
            <Droplets className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="mt-3 text-2xl font-extrabold text-slate-900">
            Create HydroSense Account
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Join the smart water management network
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ramesh Patel"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@domain.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${formData.role === 'resident' ? 'sm:grid-cols-3' : 'sm:grid-cols-1'} gap-3`}>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">User Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
              >
                <option value="resident">Resident / User</option>
                <option value="staff">Maintenance Staff</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            {formData.role === 'resident' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Building</label>
                  <select
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none font-medium"
                  >
                    <option value="Block A">Block A (Lotus)</option>
                    <option value="Block B">Block B (Emerald)</option>
                    <option value="Block C">Block C (Sapphire)</option>
                    <option value="Block D">Block D (Coral)</option>
                    <option value="Block E">Block E (Crystal)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unit / Flat No</label>
                  <input
                    type="text"
                    name="unitNumber"
                    value={formData.unitNumber}
                    onChange={handleChange}
                    placeholder="A-302"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </>
            )}

            {formData.role !== 'resident' && (
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-[11px] text-sky-700 font-medium">
                🏢 Building and zone will be auto-assigned based on your role.
              </div>
            )}
          </div>


          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-500/25 transition active:scale-95 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-sky-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
