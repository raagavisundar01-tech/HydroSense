import mongoose from 'mongoose';
import { getSeedData } from '../../../database/seedData.js';

let isUsingMemoryStore = false;
let memoryStore = {
  users: [],
  buildings: [],
  complaints: [],
  leakAlerts: [],
  demandPredictions: [],
  notifications: [],
  waterConsumption: []
};

export const getMemoryStore = () => memoryStore;
export const isMockDb = () => isUsingMemoryStore;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hydrosense';

  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500
    });
    console.log(`✅ [HydroSense DB] Connected to MongoDB at ${uri}`);

    // Auto-seed real MongoDB if empty
    const collections = await mongoose.connection.db.listCollections().toArray();
    const hasUsers = collections.some(c => c.name === 'users');
    let userCount = 0;
    if (hasUsers) {
      userCount = await mongoose.connection.db.collection('users').countDocuments();
    }
    if (userCount === 0) {
      console.log('💧 [HydroSense DB] Seeding MongoDB with realistic campus dataset...');
      const seed = await getSeedData();
      if (seed.users?.length) await mongoose.connection.db.collection('users').insertMany(seed.users);
      if (seed.buildings?.length) await mongoose.connection.db.collection('buildings').insertMany(seed.buildings);
      if (seed.complaints?.length) await mongoose.connection.db.collection('complaints').insertMany(seed.complaints);
      if (seed.waterConsumption?.length) await mongoose.connection.db.collection('waterconsumptions').insertMany(seed.waterConsumption);
      if (seed.leakAlerts?.length) await mongoose.connection.db.collection('leakalerts').insertMany(seed.leakAlerts);
      if (seed.demandPredictions?.length) await mongoose.connection.db.collection('demandpredictions').insertMany(seed.demandPredictions);
      if (seed.notifications?.length) await mongoose.connection.db.collection('notifications').insertMany(seed.notifications);
      console.log('✅ [HydroSense DB] MongoDB seeded successfully!');
    }
    return true;
  } catch (err) {
    console.warn(`⚠️ [HydroSense DB] Could not connect to MongoDB daemon (${err.message}).`);
    console.log(`💧 [HydroSense DB] Seamlessly activating Embedded In-Memory Data Store for zero-config operation...`);
    isUsingMemoryStore = true;

    // Seed the memory store
    const seed = await getSeedData();
    memoryStore = { ...seed };
    console.log(`✅ [HydroSense DB] In-Memory Data Store seeded with realistic campus water data!`);
    return false;
  }
};
