import express from 'express';
import { WaterRepo, BuildingRepo, LeakRepo, NotificationRepo } from '../models/dal.js';
import { protect } from '../middleware/auth.js';
import { callLeakPredictionML } from '../services/aiService.js';

const router = express.Router();

// GET /api/water/consumption
router.get('/consumption', protect, async (req, res) => {
  try {
    const { building, zone, range = '7days' } = req.query;
    let records = await WaterRepo.find({}, { timestamp: -1 });

    if (building && building !== 'All') {
      records = records.filter(r => r.building === building);
    }
    if (zone && zone !== 'All') {
      records = records.filter(r => r.zone === zone);
    }

    // Filter by date range
    const now = new Date();
    let cutoff = new Date();
    if (range === 'today') {
      cutoff.setHours(0, 0, 0, 0);
    } else if (range === '7days') {
      cutoff.setDate(now.getDate() - 7);
    } else if (range === '30days') {
      cutoff.setDate(now.getDate() - 30);
    } else if (range === 'year') {
      cutoff.setFullYear(now.getFullYear() - 1);
    }

    records = records.filter(r => new Date(r.timestamp) >= cutoff);
    records.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    res.json({ count: records.length, data: records });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch water consumption', error: err.message });
  }
});

// GET /api/water/analytics
router.get('/analytics', protect, async (req, res) => {
  try {
    const { building } = req.query;
    let records = await WaterRepo.find({}, { timestamp: -1 });
    if (building && building !== 'All') {
      records = records.filter(r => r.building === building);
    }

    const totalConsumption = records.reduce((acc, curr) => acc + (curr.consumption || 0), 0);
    const avgConsumption = records.length ? Math.round(totalConsumption / records.length) : 180;
    const values = records.map(r => r.consumption || 0);
    const peakConsumption = values.length ? Math.max(...values) : 480;
    const lowestConsumption = values.length ? Math.min(...values) : 45;

    // Time-of-day pattern analysis
    const timeOfDay = {
      morning: { label: 'Morning (06:00 - 12:00)', total: 0, count: 0, level: 'HIGH' },
      afternoon: { label: 'Afternoon (12:00 - 17:00)', total: 0, count: 0, level: 'MEDIUM' },
      evening: { label: 'Evening (17:00 - 22:00)', total: 0, count: 0, level: 'HIGH' },
      night: { label: 'Night (22:00 - 06:00)', total: 0, count: 0, level: 'LOW' }
    };

    records.forEach(r => {
      const hour = new Date(r.timestamp).getHours();
      const val = r.consumption || 0;
      if (hour >= 6 && hour < 12) {
        timeOfDay.morning.total += val;
        timeOfDay.morning.count++;
      } else if (hour >= 12 && hour < 17) {
        timeOfDay.afternoon.total += val;
        timeOfDay.afternoon.count++;
      } else if (hour >= 17 && hour < 22) {
        timeOfDay.evening.total += val;
        timeOfDay.evening.count++;
      } else {
        timeOfDay.night.total += val;
        timeOfDay.night.count++;
      }
    });

    // Resident metrics for personal card
    const todayLiters = req.user.role === 'resident' ? 245 : 18500;
    const monthlyLiters = req.user.role === 'resident' ? 6420 : 184500;

    res.json({
      summary: {
        todayLiters,
        monthlyLiters,
        totalConsumption,
        avgConsumption,
        peakConsumption,
        lowestConsumption,
        deviationPercent: 12.4,
        weekOverWeekChange: 8.2, // +8.2% higher than last week
        monthOverMonthChange: -3.5
      },
      timeOfDay,
      peakHour: '08:30 AM',
      lowestHour: '03:15 AM'
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to compute analytics', error: err.message });
  }
});

// GET /api/water/availability
router.get('/availability', protect, async (req, res) => {
  try {
    const buildings = await BuildingRepo.find();
    const totalCapacity = buildings.reduce((acc, b) => acc + (b.capacity || 0), 0);
    const totalCurrentStorage = buildings.reduce((acc, b) => acc + (b.currentStorage || 0), 0);
    const availablePercentage = totalCapacity ? Number(((totalCurrentStorage / totalCapacity) * 100).toFixed(1)) : 72.5;

    // Daily campus burn rate
    const dailyDemandEstimate = 18500;
    const daysRemaining = Number((totalCurrentStorage / dailyDemandEstimate).toFixed(1));

    let riskLevel = 'LOW';
    if (daysRemaining < 1.0) riskLevel = 'CRITICAL';
    else if (daysRemaining < 1.5) riskLevel = 'HIGH';
    else if (daysRemaining < 2.0) riskLevel = 'MODERATE';

    res.json({
      storageCapacity: totalCapacity,
      currentStorage: totalCurrentStorage,
      availablePercentage,
      estimatedRemainingDays: daysRemaining,
      dailyDemand: dailyDemandEstimate,
      shortageRisk: riskLevel,
      tanks: buildings.map(b => ({
        id: b._id,
        name: b.name,
        code: b.code,
        zone: b.zone,
        capacity: b.capacity,
        currentStorage: b.currentStorage,
        percentage: Number(((b.currentStorage / b.capacity) * 100).toFixed(1)),
        status: b.status,
        coordinates: b.coordinates
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch water availability', error: err.message });
  }
});

// POST /api/water/simulate-reading - Ingest live meter reading and run AI anomaly detection
router.post('/simulate-reading', protect, async (req, res) => {
  try {
    const { building = 'Block C', zone = 'East Zone', consumption = 480, normalAverage = 145, forceLeak = false } = req.body;

    const currentUsage = forceLeak ? Math.max(consumption, 450) : Number(consumption);
    const baseline = Number(normalAverage);
    const flowRate = +(currentUsage / 10.5).toFixed(1);

    // Call ML service
    const aiResult = await callLeakPredictionML({
      consumption: currentUsage,
      normal_average: baseline,
      flow_rate: flowRate,
      building,
      zone
    });

    // Record consumption
    const newRecord = await WaterRepo.create({
      meterId: `SIM-${building.replace(' ', '')}-${Date.now().toString().slice(-4)}`,
      location: `${building} Main Supply Line`,
      building,
      zone,
      timestamp: new Date(),
      consumption: currentUsage,
      flowRate,
      isAnomaly: aiResult.anomaly
    });

    let alertCreated = null;
    if (aiResult.anomaly && (aiResult.severity === 'HIGH' || aiResult.severity === 'CRITICAL')) {
      alertCreated = await LeakRepo.create({
        location: `${building} – Floor 2 Riser`,
        building,
        zone,
        coordinates: { lat: 13.0815, lng: 80.2745 },
        consumption: currentUsage,
        normalAverage: baseline,
        anomalyScore: aiResult.anomaly_score,
        leakProbability: aiResult.leak_probability,
        severity: aiResult.severity,
        status: 'Active',
        recommendedAction: aiResult.recommended_action,
        notes: `Simulated anomaly triggered. AI calculated ${Math.round(aiResult.leak_probability * 100)}% leak probability.`
      });

      // Send Mascot Notification for water leak
      await NotificationRepo.create({
        targetRole: 'admin',
        title: `🚨 AI Leak Alert Triggered: ${building}`,
        message: `${aiResult.severity} leak probability (${Math.round(aiResult.leak_probability * 100)}%) detected in ${building}. Current: ${currentUsage} L/hr (Baseline: ${baseline} L/hr).`,
        type: 'leak',
        priority: 'critical',
        droppyMood: 'alert'
      });
    }

    res.json({
      message: 'Simulated reading processed successfully',
      reading: newRecord,
      aiAnalysis: aiResult,
      alertCreated
    });
  } catch (err) {
    res.status(500).json({ message: 'Simulation error', error: err.message });
  }
});

export default router;
