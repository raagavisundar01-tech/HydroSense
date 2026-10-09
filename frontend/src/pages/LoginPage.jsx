import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, Shield, Wrench, Home, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { DroppyCartoonSVG } from '../components/WaterMascotNotification';
import { SignInButton, useUser } from '@clerk/clerk-react';

export const LoginPage = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.error || '');
  const [loading, setLoading] = useState(false);
  const { login, quickSwitchRole } = useAuth();
  const navigate = useNavigate();

  // Clear location state after rendering the error so it doesn't persist on refresh
  useEffect(() => {
    if (location.state?.error) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') navigate('/admin/dashboard');
      else if (data.user.role === 'staff') navigate('/staff/dashboard');
      else navigate('/resident/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      const data = await quickSwitchRole(role);
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'staff') navigate('/staff/dashboard');
      else navigate('/resident/dashboard');
    } catch (err) {
      setError('Demo login failed. Make sure backend is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50 via-cyan-50/30 to-slate-50">
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-md p-8 rounded-3xl border border-sky-100 shadow-xl">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-sky-500 to-cyan-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
            <Droplets className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">
            Welcome to HydroSense
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Sign in to access water intelligence and monitoring
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Demo Login Shortcuts */}
        <div className="p-4 bg-sky-50/70 rounded-2xl border border-sky-100">
          <p className="text-[11px] font-bold text-sky-800 uppercase tracking-wider mb-2.5 text-center">
            🚀 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('resident')}
              className="p-2.5 bg-white hover:bg-cyan-50 border border-sky-200 rounded-xl text-center transition group shadow-sm"
            >
              <Home className="w-4 h-4 mx-auto text-cyan-600 group-hover:scale-110 transition" />
              <p className="text-[11px] font-bold text-slate-800 mt-1">Resident</p>
              <p className="text-[9px] text-slate-400">Aditya</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('staff')}
              className="p-2.5 bg-white hover:bg-amber-50 border border-amber-200 rounded-xl text-center transition group shadow-sm"
            >
              <Wrench className="w-4 h-4 mx-auto text-amber-600 group-hover:scale-110 transition" />
              <p className="text-[11px] font-bold text-slate-800 mt-1">Staff</p>
              <p className="text-[9px] text-slate-400">Rajesh</p>
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="p-2.5 bg-white hover:bg-purple-50 border border-purple-200 rounded-xl text-center transition group shadow-sm"
            >
              <Shield className="w-4 h-4 mx-auto text-purple-600 group-hover:scale-110 transition" />
              <p className="text-[11px] font-bold text-slate-800 mt-1">Admin</p>
              <p className="text-[9px] text-slate-400">Dr. Neha</p>
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-400">or sign in with email</span>
          </div>
        </div>

        {/* Google / Clerk Sign-In */}
        <SignInButton mode="modal" forceRedirectUrl={window.location.origin + '/resident/dashboard'}>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </SignInButton>

        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="resident@hydrosense.io"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-500/25 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-sky-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
