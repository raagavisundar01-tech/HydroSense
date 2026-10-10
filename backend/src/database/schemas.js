import mongoose from 'mongoose';

// User Schema
export const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, enum: ['resident', 'staff', 'admin'], default: 'resident' },
  building: { type: String, default: 'Block A' },
  zone: { type: String, default: 'Zone 1' },
  unitNumber: { type: String, default: 'A-204' },
  avatar: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Complaint Schema
export const ComplaintSchema = new mongoose.Schema({
  complaintId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, default: '' },
  userEmail: { type: String, default: '' },
  category: {
    type: String,
    enum: [
      'Pipeline Leakage',
      'Tank Overflow',
      'No Water Supply',
      'Low Water Pressure',
      'Water Quality Issue',
      'Damaged Pipeline',
      'Water Wastage',
      'Drainage Issue',
      'Other'
    ],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  building: { type: String, required: true },
  zone: { type: String, required: true },
  coordinates: {
    lat: { type: Number, default: 13.0827 },
    lng: { type: Number, default: 80.2707 }
  },
  images: [{ type: String }],
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'MEDIUM' },
  status: {
    type: String,
    enum: ['Submitted', 'Under Review', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
    default: 'Submitted'
  },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedStaffName: { type: String, default: '' },
  resolutionNotes: { type: String, default: '' },
  resolutionImage: { type: String, default: '' },
  timeline: [
    {
      status: String,
      message: String,
      updatedBy: String,
      timestamp: { type: Date, default: Date.now }
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

// Water Consumption Schema (Hourly & Daily readings)
export const WaterConsumptionSchema = new mongoose.Schema({
  meterId: { type: String, required: true },
  location: { type: String, required: true },
  building: { type: String, required: true },
  zone: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  consumption: { type: Number, required: true }, // Litres
  flowRate: { type: Number, default: 0 },         // L/min
  source: { type: String, default: 'Municipal + Borewell' },
  isAnomaly: { type: Boolean, default: false }
});

// Leak Alert Schema (AI anomaly detection)
export const LeakAlertSchema = new mongoose.Schema({
  location: { type: String, required: true },
  building: { type: String, required: true },
  zone: { type: String, required: true },
  coordinates: {
    lat: { type: Number, default: 13.0827 },
    lng: { type: Number, default: 80.2707 }
  },
  consumption: { type: Number, required: true },
  normalAverage: { type: Number, required: true },
  anomalyScore: { type: Number, default: 0 },
  leakProbability: { type: Number, required: true }, // e.g. 0.92
  severity: { type: String, enum: ['NORMAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  status: { type: String, enum: ['Active', 'Investigating', 'Resolved', 'Dismissed'], default: 'Active' },
  assignedStaff: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  assignedStaffName: { type: String, default: '' },
  recommendedAction: { type: String, default: '' },
  notes: { type: String, default: '' },
  detectedAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
});

// Demand Prediction Schema
export const DemandPredictionSchema = new mongoose.Schema({
  location: { type: String, default: 'Central Campus' },
  date: { type: String, required: true },
  predictedDemand: { type: Number, required: true },
  actualDemand: { type: Number, default: null },
  currentAvailable: { type: Number, default: 14200 },
  storageCapacity: { type: Number, default: 25000 },
  expectedShortage: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'MODERATE' },
  daysRemaining: { type: Number, default: 1.5 },
  recommendation: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Building & Zone Schema
export const BuildingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true },
  zone: { type: String, required: true },
  capacity: { type: Number, required: true }, // Max tank capacity in Litres
  currentStorage: { type: Number, required: true }, // Current water in tank
  occupancy: { type: Number, default: 350 },
  status: { type: String, enum: ['NORMAL', 'HIGH USAGE', 'POSSIBLE LEAK', 'LOW STORAGE'], default: 'NORMAL' },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  dailyAverage: { type: Number, default: 5200 },
  createdAt: { type: Date, default: Date.now }
});

// In-app & Water Mascot Notification Schema
export const NotificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null = global/role broadcast
  targetRole: { type: String, enum: ['all', 'resident', 'staff', 'admin'], default: 'all' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['alert', 'complaint', 'leak', 'shortage', 'tip', 'maintenance', 'system'],
    default: 'alert'
  },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  read: { type: Boolean, default: false },
  droppyMood: { type: String, enum: ['happy', 'warning', 'alert', 'thinking', 'celebrate'], default: 'happy' },
  createdAt: { type: Date, default: Date.now }
});
