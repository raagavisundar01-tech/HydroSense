import mongoose from 'mongoose';
import {
  UserSchema,
  ComplaintSchema,
  WaterConsumptionSchema,
  LeakAlertSchema,
  DemandPredictionSchema,
  BuildingSchema,
  NotificationSchema
} from '../../../database/schemas.js';
import { getMemoryStore, isMockDb } from '../config/db.js';

// Mongoose Models
export const MongooseUser = mongoose.models.User || mongoose.model('User', UserSchema);
export const MongooseComplaint = mongoose.models.Complaint || mongoose.model('Complaint', ComplaintSchema);
export const MongooseWater = mongoose.models.WaterConsumption || mongoose.model('WaterConsumption', WaterConsumptionSchema);
export const MongooseLeak = mongoose.models.LeakAlert || mongoose.model('LeakAlert', LeakAlertSchema);
export const MongooseDemand = mongoose.models.DemandPrediction || mongoose.model('DemandPrediction', DemandPredictionSchema);
export const MongooseBuilding = mongoose.models.Building || mongoose.model('Building', BuildingSchema);
export const MongooseNotification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// Helper for filtering arrays in mock mode
const matchFilter = (item, filter) => {
  if (!filter || Object.keys(filter).length === 0) return true;
  for (const key of Object.keys(filter)) {
    if (key === '_id') {
      const targetId = filter._id.toString();
      const itemId = item._id ? item._id.toString() : '';
      if (itemId !== targetId) return false;
      continue;
    }
    if (key === '$or' && Array.isArray(filter.$or)) {
      const matchesAny = filter.$or.some(subFilter => matchFilter(item, subFilter));
      if (!matchesAny) return false;
      continue;
    }
    if (typeof filter[key] === 'object' && filter[key] !== null) {
      if (filter[key].$in && Array.isArray(filter[key].$in)) {
        if (!filter[key].$in.includes(item[key])) return false;
        continue;
      }
      if (filter[key].$ne !== undefined) {
        if (item[key] === filter[key].$ne) return false;
        continue;
      }
    }
    if (item[key] !== filter[key]) return false;
  }
  return true;
};

// Generic Repository
export const createRepo = (collectionName, MongooseModel) => ({
  async find(filter = {}, sort = { createdAt: -1 }) {
    if (!isMockDb()) {
      return await MongooseModel.find(filter).sort(sort).lean();
    }
    const store = getMemoryStore();
    const list = store[collectionName] || [];
    let results = list.filter(item => matchFilter(item, filter));
    return results;
  },

  async findOne(filter = {}) {
    if (!isMockDb()) {
      return await MongooseModel.findOne(filter).lean();
    }
    const store = getMemoryStore();
    const list = store[collectionName] || [];
    return list.find(item => matchFilter(item, filter)) || null;
  },

  async findById(id) {
    if (!isMockDb()) {
      return await MongooseModel.findById(id).lean();
    }
    const store = getMemoryStore();
    const list = store[collectionName] || [];
    return list.find(item => (item._id && item._id.toString() === id.toString())) || null;
  },

  async create(data) {
    if (!isMockDb()) {
      return await MongooseModel.create(data);
    }
    const store = getMemoryStore();
    const newItem = {
      _id: (data._id || new mongoose.Types.ObjectId()).toString(),
      ...data,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date()
    };
    if (!store[collectionName]) store[collectionName] = [];
    store[collectionName].unshift(newItem);
    return newItem;
  },

  async findByIdAndUpdate(id, updates, options = { new: true }) {
    if (!isMockDb()) {
      return await MongooseModel.findByIdAndUpdate(id, updates, options).lean();
    }
    const store = getMemoryStore();
    const list = store[collectionName] || [];
    const index = list.findIndex(item => item._id && item._id.toString() === id.toString());
    if (index === -1) return null;

    const current = list[index];
    const updated = {
      ...current,
      ...updates,
      updatedAt: new Date()
    };
    list[index] = updated;
    return updated;
  },

  async countDocuments(filter = {}) {
    if (!isMockDb()) {
      return await MongooseModel.countDocuments(filter);
    }
    const store = getMemoryStore();
    const list = store[collectionName] || [];
    return list.filter(item => matchFilter(item, filter)).length;
  },

  async deleteOne(filter = {}) {
    if (!isMockDb()) {
      return await MongooseModel.deleteOne(filter);
    }
    const store = getMemoryStore();
    const list = store[collectionName] || [];
    const index = list.findIndex(item => matchFilter(item, filter));
    if (index !== -1) {
      list.splice(index, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }
});

export const UserRepo = createRepo('users', MongooseUser);
export const ComplaintRepo = createRepo('complaints', MongooseComplaint);
export const WaterRepo = createRepo('waterConsumption', MongooseWater);
export const LeakRepo = createRepo('leakAlerts', MongooseLeak);
export const DemandRepo = createRepo('demandPredictions', MongooseDemand);
export const BuildingRepo = createRepo('buildings', MongooseBuilding);
export const NotificationRepo = createRepo('notifications', MongooseNotification);
