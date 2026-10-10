import dotenv from 'dotenv';
import mongoose from 'dotenv';
import { connectDB } from './config/db.js';
import { getSeedData } from './database/seedData.js';
import {
  MongooseUser,
  MongooseBuilding,
  MongooseComplaint,
  MongooseWater,
  MongooseLeak,
  MongooseDemand,
  MongooseNotification
} from './models/dal.js';

dotenv.config();

const seed = async () => {
  console.log('💧 Initializing HydroSense database seeding...');
  await connectDB();

  const data = await getSeedData();

  try {
    await MongooseUser.deleteMany({});
    await MongooseUser.insertMany(data.users);

    await MongooseBuilding.deleteMany({});
    await MongooseBuilding.insertMany(data.buildings);

    await MongooseComplaint.deleteMany({});
    await MongooseComplaint.insertMany(data.complaints);

    await MongooseWater.deleteMany({});
    await MongooseWater.insertMany(data.waterConsumption);

    await MongooseLeak.deleteMany({});
    await MongooseLeak.insertMany(data.leakAlerts);

    await MongooseDemand.deleteMany({});
    await MongooseDemand.insertMany(data.demandPredictions);

    await MongooseNotification.deleteMany({});
    await MongooseNotification.insertMany(data.notifications);

    console.log('✅ All collections seeded successfully with realistic campus water data!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
