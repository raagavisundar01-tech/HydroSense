import React, { useState, useEffect } from 'react';
import { Users, Shield, Wrench, Home, Mail, Phone, Building } from 'lucide-react';
import axios from 'axios';

export const UserDirectoryPage = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/users');
      setUsers(res.data.users || []);
    } catch (e) {
      console.warn('Error fetching users:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Community Directory</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Users & Maintenance Staff Directory
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered campus residents, technicians on call, and administrative supervisors.
          </p>
        </div>

        {/* Role Filters */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 rounded-xl text-xs font-semibold">
          {['ALL', 'resident', 'staff', 'admin'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg transition capitalize ${
                roleFilter === r ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {r === 'ALL' ? 'All Members' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((u) => (
          <div
            key={u._id}
            className="bg-white p-5 rounded-3xl border border-sky-100 shadow-sm water-card space-y-3"
          >
            <div className="flex items-center space-x-3">
              <img
                src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                alt={u.name}
                className="w-12 h-12 rounded-2xl object-cover border border-sky-100"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-slate-900 truncate">{u.name}</h3>
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider mt-0.5 ${
                  u.role === 'admin'
                    ? 'bg-purple-100 text-purple-700'
                    : u.role === 'staff'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-cyan-100 text-cyan-800'
                }`}>
                  {u.role}
                </span>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate">{u.email}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{u.phone || 'N/A'}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{u.building} • {u.unitNumber || u.zone}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDirectoryPage;
