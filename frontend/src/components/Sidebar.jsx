import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BarChart3,
  FileQuestion,
  Activity,
  TrendingUp,
  Droplets,
  MapPin,
  ClipboardList,
  Users,
  FileText,
  Lightbulb,
  ShieldAlert,
  Wrench,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  // Nav configurations based on role
  const getNavItems = () => {
    if (role === 'admin') {
      return [
        { label: 'Admin Command Center', to: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Water Analytics', to: '/water-analytics', icon: BarChart3 },
        { label: 'AI Leak Detection', to: '/ai-leak-detection', icon: Activity, badge: 'AI' },
        { label: 'Demand Prediction', to: '/demand-prediction', icon: TrendingUp, badge: 'ML' },
        { label: 'Storage & Availability', to: '/water-availability', icon: Droplets },
        { label: 'Campus Map Monitor', to: '/campus-map', icon: MapPin },
        { label: 'All Complaints', to: '/complaints', icon: ClipboardList },
        { label: 'User & Staff Directory', to: '/admin/users', icon: Users },
        { label: 'Reports & Audits', to: '/reports', icon: FileText },
        { label: 'AI Recommendations', to: '/recommendations', icon: Lightbulb },
      ];
    }

    if (role === 'staff') {
      return [
        { label: 'Staff Task Board', to: '/staff/dashboard', icon: LayoutDashboard },
        { label: 'Assigned Complaints', to: '/complaints', icon: ClipboardList },
        { label: 'AI Leak Alerts', to: '/ai-leak-detection', icon: ShieldAlert, badge: 'AI' },
        { label: 'Water Availability', to: '/water-availability', icon: Droplets },
        { label: 'Campus Map', to: '/campus-map', icon: MapPin },
        { label: 'AI Recommendations', to: '/recommendations', icon: Lightbulb },
      ];
    }

    // Resident
    return [
      { label: 'Personal Dashboard', to: '/resident/dashboard', icon: LayoutDashboard },
      { label: 'My Water Usage', to: '/water-analytics', icon: BarChart3 },
      { label: 'Submit Complaint', to: '/submit-complaint', icon: FileQuestion },
      { label: 'My Complaints', to: '/complaints', icon: ClipboardList },
      { label: 'Water Availability', to: '/water-availability', icon: Droplets },
      { label: 'AI Recommendations', to: '/recommendations', icon: Lightbulb, badge: 'AI' },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-sky-100 flex-shrink-0 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between hidden md:flex">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-extrabold uppercase tracking-wider text-sky-600 flex items-center justify-between">
          <span>Navigation</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-sky-50 text-sky-700 rounded border border-sky-200">
            {role.toUpperCase()}
          </span>
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500 to-cyan-600 text-white shadow-md shadow-sky-500/20'
                    : 'text-slate-600 hover:text-sky-700 hover:bg-sky-50/70'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-sky-600'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                        isActive ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Water Saving Campus Status Widget in sidebar footer */}
      <div className="bg-gradient-to-br from-sky-50 to-cyan-100/60 p-3.5 rounded-2xl border border-sky-200">
        <div className="flex items-center space-x-2 text-sky-800 font-bold text-xs">
          <Droplets className="w-4 h-4 text-sky-600 fill-sky-600" />
          <span>Campus Grid Status</span>
        </div>
        <p className="text-[11px] text-slate-600 mt-1 leading-snug">
          Storage at 72.8%. Anomaly monitoring active on 32 campus water meters.
        </p>
        <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-500 to-sky-600 h-1.5 rounded-full" style={{ width: '72.8%' }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
