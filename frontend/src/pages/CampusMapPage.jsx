import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, AlertTriangle, ShieldCheck, Droplets, Info, Filter } from 'lucide-react';
import axios from 'axios';

// --------------- Custom Marker Icons ---------------
const createCustomIcon = (color, size = 36) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${size}" height="${size}">
    <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
    <circle cx="12" cy="9" r="3.5" fill="#ffffff"/>
  </svg>`;
  return L.divIcon({
    html: svg,
    className: 'custom-leaflet-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -(size - 4)]
  });
};

const icons = {
  red:    createCustomIcon('#ef4444'),
  orange: createCustomIcon('#f59e0b'),
  green:  createCustomIcon('#10b981'),
  blue:   createCustomIcon('#0284c7'),
  purple: createCustomIcon('#8b5cf6'),
};

// Building reference coordinates (used as fallback for complaints without GPS)
const BUILDING_COORDS = {
  'Block A': { lat: 13.0850, lng: 80.2700 },
  'Block B': { lat: 13.0825, lng: 80.2680 },
  'Block C': { lat: 13.0815, lng: 80.2745 },
  'Block D': { lat: 13.0780, lng: 80.2710 },
  'Block E': { lat: 13.0835, lng: 80.2725 },
};

// Small deterministic offset so complaints from the same building don't overlap
const buildingOffset = (buildingName, idx) => {
  const offsets = [
    [0.0003, 0.0002], [-0.0002, 0.0004], [0.0004, -0.0003],
    [-0.0004, -0.0002], [0.0001, 0.0005], [-0.0005, 0.0001],
  ];
  const [dlat, dlng] = offsets[idx % offsets.length];
  return dlat + (dlng * 0.1);
};

const resolveComplaintCoords = (complaint, idx) => {
  if (
    complaint.location?.coordinates?.lat &&
    complaint.location?.coordinates?.lng &&
    Math.abs(complaint.location.coordinates.lat - 13.0827) > 0.0001
  ) {
    return [complaint.location.coordinates.lat, complaint.location.coordinates.lng];
  }
  // Fallback: use building center + small spread
  const bldName = complaint.building || 'Block A';
  const base = BUILDING_COORDS[bldName] || BUILDING_COORDS['Block A'];
  const offset = buildingOffset(bldName, idx);
  return [base.lat + offset, base.lng - offset];
};

const priorityIcon = (priority) => {
  if (priority === 'CRITICAL') return icons.red;
  if (priority === 'HIGH') return icons.orange;
  if (priority === 'MEDIUM') return icons.purple;
  return icons.blue;
};

const buildingIcon = (status) => {
  if (status === 'POSSIBLE LEAK' || status === 'CRITICAL') return icons.red;
  if (status === 'HIGH USAGE' || status === 'LOW STORAGE') return icons.orange;
  return icons.green;
};

// --------------- Map Auto-Recenter Helper ---------------
function SetCenter({ center }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 15); }, [center]);
  return null;
}

// --------------- Main Component ---------------
export const CampusMapPage = () => {
  const [buildings, setBuildings] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [leakAlerts, setLeakAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'buildings' | 'complaints' | 'leaks'
  const [userLocation, setUserLocation] = useState(null);
  const campusCenter = [13.0827, 80.2707];

  useEffect(() => {
    fetchMapData();
    // Try to get user's actual location for context
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation([pos.coords.latitude, pos.coords.longitude]),
        () => {} // silent fail — keep campus center
      );
    }
  }, []);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('hydrosense_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const [bldRes, compRes, leakRes] = await Promise.all([
        axios.get('/api/admin/buildings', { headers }),
        axios.get('/api/complaints', { headers }),
        axios.get('/api/ai/leak-alerts', { headers }),
      ]);
      setBuildings(bldRes.data.buildings || []);
      setComplaints(compRes.data.complaints || []);
      setLeakAlerts(leakRes.data.alerts || []);
    } catch (e) {
      console.warn('Map data load error:', e.message);
    } finally {
      setLoading(false);
    }
  };

  const statusColor = {
    Open: 'bg-rose-100 text-rose-700',
    'In Progress': 'bg-amber-100 text-amber-700',
    Resolved: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-sky-600 text-xs font-bold uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4" />
            <span>Geospatial Infrastructure Telemetry</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Map-Based Campus Monitoring</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Live pins for buildings, active complaints, pipe anomalies, and maintenance zones.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { key: 'all', label: 'All Layers' },
            { key: 'buildings', label: 'Buildings' },
            { key: 'complaints', label: 'Complaints' },
            { key: 'leaks', label: 'Leak Alerts' },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filter === key
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-sky-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Buildings', value: buildings.length, color: 'text-sky-600', bg: 'bg-sky-50' },
          { label: 'Active Complaints', value: complaints.filter(c => c.status !== 'Resolved').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Leak Alerts', value: leakAlerts.filter(l => l.status === 'Active').length, color: 'text-rose-600', bg: 'bg-rose-50' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`${bg} p-3 rounded-2xl border border-white/60 shadow-sm text-center`}>
            <p className={`text-xl font-extrabold ${color}`}>{value}</p>
            <p className="text-[11px] text-slate-600 font-semibold">{label}</p>
          </div>
        ))}
      </div>

      {/* Map */}
      <div className="bg-white p-3 rounded-3xl border border-sky-100 shadow-md h-[540px] relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/80 rounded-2xl">
            <div className="animate-spin w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full" />
          </div>
        )}

        <MapContainer
          center={campusCenter}
          zoom={15}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%', borderRadius: '1.25rem' }}
        >
          {userLocation && <SetCenter center={userLocation} />}

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Building Markers */}
          {(filter === 'all' || filter === 'buildings') && buildings.map((b) => (
            <Marker
              key={b._id}
              position={[b.coordinates?.lat || 13.0827, b.coordinates?.lng || 80.2707]}
              icon={buildingIcon(b.status)}
            >
              <Popup>
                <div className="p-1 space-y-1 min-w-[160px]">
                  <h4 className="font-bold text-xs text-slate-900">{b.name}</h4>
                  <p className="text-[11px] text-slate-600">Zone: {b.zone}</p>
                  <p className="text-[11px]">
                    Storage: <span className="font-bold">{b.currentStorage?.toLocaleString()} L</span>{' '}
                    ({Math.round((b.currentStorage / b.capacity) * 100)}%)
                  </p>
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    b.status === 'POSSIBLE LEAK' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Complaint Markers */}
          {(filter === 'all' || filter === 'complaints') && complaints.map((c, idx) => {
            const pos = resolveComplaintCoords(c, idx);
            return (
              <Marker
                key={c._id}
                position={pos}
                icon={priorityIcon(c.priority)}
              >
                <Popup>
                  <div className="p-1 space-y-1 min-w-[180px]">
                    <h4 className="font-bold text-xs text-slate-900">
                      #{c.complaintId || c._id?.slice(-6)} — {c.title}
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Type: <span className="font-semibold">{c.type}</span>
                    </p>
                    <p className="text-[11px] text-slate-600">
                      Building: {c.building || 'Unknown'}
                    </p>
                    <div className="flex items-center gap-1 flex-wrap mt-0.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                        c.priority === 'HIGH' ? 'bg-amber-100 text-amber-700' :
                        'bg-sky-100 text-sky-700'
                      }`}>{c.priority}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusColor[c.status] || 'bg-slate-100 text-slate-600'}`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Leak Alert Circles */}
          {(filter === 'all' || filter === 'leaks') && leakAlerts.filter(l => l.status === 'Active').map((l) => (
            <Circle
              key={l._id}
              center={[l.coordinates?.lat || 13.0815, l.coordinates?.lng || 80.2745]}
              pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25, dashArray: '6 4' }}
              radius={90}
            >
              <Popup>
                <div className="p-1 space-y-1 min-w-[150px]">
                  <h4 className="font-bold text-xs text-rose-700">⚠ Leak Alert</h4>
                  <p className="text-[11px] text-slate-600">Location: {l.location}</p>
                  <p className="text-[11px] text-slate-600">
                    Probability: <span className="font-bold text-rose-600">{Math.round((l.leakProbability || 0.9) * 100)}%</span>
                  </p>
                  <p className="text-[11px] font-bold text-rose-700">{l.severity}</p>
                </div>
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-sm">
        <p className="text-xs font-bold text-slate-700 mb-3">Map Legend</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { color: 'bg-emerald-500', label: 'Building — Normal' },
            { color: 'bg-amber-500', label: 'Building — Warning' },
            { color: 'bg-rose-500', label: 'Complaint — Critical / Leak' },
            { color: 'bg-sky-500', label: 'Complaint — Medium / Low' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2 text-xs text-slate-600">
              <span className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CampusMapPage;
