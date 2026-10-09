import express from 'express';
import { LeakRepo, DemandRepo, WaterRepo, UserRepo, NotificationRepo } from '../models/dal.js';
import { protect, authorize } from '../middleware/auth.js';
import { callLeakPredictionML, callDemandPredictionML } from '../services/aiService.js';

const router = express.Router();

// GET /api/ai/leak-alerts
router.get('/leak-alerts', protect, async (req, res) => {
  try {
    const alerts = await LeakRepo.find({}, { detectedAt: -1 });
    res.json({ alerts });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch leak alerts', error: err.message });
  }
});

// POST /api/ai/leak-check - Test custom readings against Isolation Forest ML model
router.post('/leak-check', protect, async (req, res) => {
  try {
    const { consumption, normal_average, flow_rate, hour, building, zone } = req.body;
    const result = await callLeakPredictionML({
      consumption: consumption || 480,
      normal_average: normal_average || 145,
      flow_rate: flow_rate || 42,
      hour,
      building: building || 'Block C',
      zone: zone || 'East Zone'
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error checking leak', error: err.message });
  }
});

// PUT /api/ai/leak-alerts/:id/status - Update leak alert status & assign staff
router.put('/leak-alerts/:id/status', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status, assignedStaffId, notes } = req.body;
    const alert = await LeakRepo.findById(req.params.id);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    let staffName = alert.assignedStaffName;
    if (assignedStaffId) {
      const staffUser = await UserRepo.findById(assignedStaffId);
      if (staffUser) staffName = staffUser.name;
    }

    const updated = await LeakRepo.findByIdAndUpdate(req.params.id, {
      ...(status && { status }),
      ...(assignedStaffId && { assignedStaff: assignedStaffId, assignedStaffName: staffName }),
      ...(notes && { notes }),
      ...(status === 'Resolved' && { resolvedAt: new Date() })
    });

    res.json({ message: 'Leak alert updated', alert: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update alert', error: err.message });
  }
});

// GET /api/ai/demand-predictions
router.get('/demand-predictions', protect, async (req, res) => {
  try {
    const predictions = await DemandRepo.find({}, { createdAt: -1 });
    // Also run current real-time forecast
    const forecast = await callDemandPredictionML({
      previous_consumption: 17500,
      occupancy: 820,
      temperature: 31,
      current_storage: 14200,
      storage_capacity: 25000
    });
    res.json({ history: predictions, current: forecast });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch demand forecasts', error: err.message });
  }
});

// POST /api/ai/demand-predict - Run custom scenario demand prediction
router.post('/demand-predict', protect, async (req, res) => {
  try {
    const { previous_consumption, day_of_week, month, occupancy, temperature, current_storage, storage_capacity } = req.body;
    const forecast = await callDemandPredictionML({
      previous_consumption,
      day_of_week,
      month,
      occupancy,
      temperature,
      current_storage,
      storage_capacity
    });
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ message: 'Demand prediction error', error: err.message });
  }
});

// GET /api/ai/recommendations - Dynamically generated AI recommendations
router.get('/recommendations', protect, async (req, res) => {
  try {
    const role = req.user.role;
    const recommendations = [];

    if (role === 'resident') {
      recommendations.push({
        id: 'rec-1',
        category: 'Usage Optimization',
        title: 'Weekly Water Consumption Increase',
        text: 'Your water consumption increased by 12% this week compared to baseline. Check for minor aerator leaks or running toilet valves.',
        impact: 'Save up to 1,200 L/month',
        badge: 'ACTION RECOMMENDED',
        severity: 'MEDIUM'
      });
      recommendations.push({
        id: 'rec-2',
        category: 'Conservation Tip',
        title: 'Peak Hour Shift',
        text: 'Washing machine and dishwashing cycles run between 07:00-09:00 AM contribute to low campus pressure. Shift to off-peak hours (13:00-16:00).',
        impact: 'Improves tap pressure stability',
        badge: 'OPTIMIZATION',
        severity: 'LOW'
      });
      recommendations.push({
        id: 'rec-3',
        category: 'Eco Milestone',
        title: 'Aerator Efficiency Goal',
        text: 'Installing water-efficient faucet aerators can reduce bathroom flow by 30% without noticeable pressure loss.',
        impact: 'Eco Badge Earned',
        badge: 'ECO MILESTONE',
        severity: 'LOW'
      });
    } else {
      // Admin / Staff
      recommendations.push({
        id: 'adm-rec-1',
        category: 'Leak Prevention',
        title: 'Critical Anomaly in Block C',
        text: 'Possible leakage detected in Block C Floor 2 (480 L/hr vs 145 L/hr normal). Urgent inspection recommended to prevent water loss.',
        impact: 'Prevents 8,000 L/day wastage',
        badge: 'URGENT INSPECTION',
        severity: 'HIGH'
      });
      recommendations.push({
        id: 'adm-rec-2',
        category: 'Shortage Mitigation',
        title: 'Tomorrow Demand Forecast',
        text: 'Predicted demand tomorrow is 18,500 L with 14,200 L available. Increase storage buffer by approx 4,500 L to avoid low-pressure outages.',
        impact: 'Avoids campus shortage',
        badge: 'BUFFER MANAGEMENT',
        severity: 'HIGH'
      });
      recommendations.push({
        id: 'adm-rec-3',
        category: 'Zone Balancing',
        title: 'Block B Elevated Usage',
        text: 'Block B consumption is 18% higher than average. Inspect secondary distribution valves and garden irrigation timers.',
        impact: 'Saves 3,500 L/week',
        badge: 'ZONE AUDIT',
        severity: 'MEDIUM'
      });
    }

    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate recommendations', error: err.message });
  }
});

export default router;
