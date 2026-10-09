import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Droplets,
  Bell,
  User,
  LogOut,
  Shield,
  Wrench,
  Home,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

export const Navbar = () => {
  const { user, logout, quickSwitchRole } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
      const interval = setInterval(loadNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications');
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (e) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await axios.put('/api/notifications/mark-all-read');
      loadNotifications();
    } catch (e) {}
  };

  const handleRoleChange = async (role) => {
    setShowRoleMenu(false);
    await quickSwitchRole(role);
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'staff') navigate('/staff/dashboard');
    else navigate('/resident/dashboard');
  };

  const getRoleBadge = (role) => {
    if (role === 'admin') {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
          <Shield className="w-3 h-3" />
          <span>Administrator</span>
        </span>
      );
    }
    if (role === 'staff') {
      return (
        <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
          <Wrench className="w-3 h-3" />
          <span>Maintenance Staff</span>
        </span>
      );
    }
    return (
      <span className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-100 text-cyan-700 border border-cyan-200">
        <Home className="w-3 h-3" />
        <span>Resident</span>
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-sky-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition transform">
              <Droplets className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold bg-gradient-to-r from-sky-700 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                  HydroSense
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-sky-100 text-sky-700 rounded-md">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Smarter Water. Better Future.
              </p>
            </div>
          </Link>

          {/* Center Navigation Links (Public or Quick Dash) */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'staff' ? '/staff/dashboard' : '/resident/dashboard'}
                  className="hover:text-sky-600 transition"
                >
                  Dashboard
                </Link>
                <Link to="/water-analytics" className="hover:text-sky-600 transition">
                  Consumption Analytics
                </Link>
                <Link to="/complaints" className="hover:text-sky-600 transition">
                  Complaints
                </Link>
                <Link to="/water-availability" className="hover:text-sky-600 transition">
                  Availability
                </Link>
                {user.role === 'admin' && (
                  <>
                    <Link to="/ai-leak-detection" className="hover:text-sky-600 transition">
                      AI Leaks
                    </Link>
                    <Link to="/campus-map" className="hover:text-sky-600 transition">
                      Campus Map
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <a href="#features" className="hover:text-sky-600 transition">Features</a>
                <a href="#how-it-works" className="hover:text-sky-600 transition">How It Works</a>
                <a href="#benefits" className="hover:text-sky-600 transition">Benefits</a>
              </>
            )}
          </nav>

          {/* Right Action Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                {/* Role Switcher Pill */}
                <div className="relative">
                  <button
                    onClick={() => setShowRoleMenu(!showRoleMenu)}
                    className="flex items-center space-x-1.5 hover:opacity-90 transition focus:outline-none"
                    title="Switch user demo role"
                  >
                    {getRoleBadge(user.role)}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showRoleMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-sky-100 py-1 z-50 animate-pop-in">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                          Demo Role Switcher
                        </p>
                      </div>
                      <button
                        onClick={() => handleRoleChange('admin')}
                        className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-sky-50 ${
                          user.role === 'admin' ? 'text-purple-600 font-bold bg-purple-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <Shield className="w-3.5 h-3.5 text-purple-600" />
                          <span>Dr. Neha Verma (Admin)</span>
                        </span>
                        {user.role === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-purple-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleChange('staff')}
                        className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-sky-50 ${
                          user.role === 'staff' ? 'text-amber-600 font-bold bg-amber-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <Wrench className="w-3.5 h-3.5 text-amber-600" />
                          <span>Rajesh Kumar (Staff)</span>
                        </span>
                        {user.role === 'staff' && <CheckCircle className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                      <button
                        onClick={() => handleRoleChange('resident')}
                        className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center justify-between hover:bg-sky-50 ${
                          user.role === 'resident' ? 'text-cyan-700 font-bold bg-cyan-50/50' : 'text-slate-700'
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <Home className="w-3.5 h-3.5 text-cyan-600" />
                          <span>Aditya Sharma (Resident)</span>
                        </span>
                        {user.role === 'resident' && <CheckCircle className="w-3.5 h-3.5 text-cyan-600" />}
                      </button>
                    </div>
                  )}
                </div>

                {/* Notifications Bell Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                    className="p-2 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-xl relative transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showNotifDropdown && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-sky-100 py-2 z-50 animate-pop-in">
                      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100">
                        <div className="flex items-center space-x-2">
                          <Bell className="w-4 h-4 text-sky-600" />
                          <h4 className="text-sm font-bold text-slate-800">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-sky-600 hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            No notifications right now
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              className={`p-3.5 hover:bg-sky-50/50 transition flex items-start space-x-3 ${
                                !n.read ? 'bg-sky-50/30' : ''
                              }`}
                            >
                              <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
                                n.priority === 'critical'
                                  ? 'bg-rose-100 text-rose-600'
                                  : n.priority === 'high'
                                  ? 'bg-amber-100 text-amber-600'
                                  : 'bg-cyan-100 text-cyan-600'
                              }`}>
                                {n.priority === 'critical' ? (
                                  <AlertTriangle className="w-4 h-4" />
                                ) : (
                                  <Droplets className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-slate-900 leading-snug">
                                  {n.title}
                                </h5>
                                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                                  {n.message}
                                </p>
                                <span className="text-[10px] text-slate-400 mt-1 block">
                                  {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Name & Logout */}
                <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-xs border border-sky-200">
                    {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-800 leading-none">{user.name}</p>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">{user.building || 'Campus'}</p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-sky-700 hover:bg-sky-50 rounded-xl transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-sky-500 to-cyan-600 hover:from-sky-600 hover:to-cyan-700 rounded-xl shadow-sm transition active:scale-95"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
