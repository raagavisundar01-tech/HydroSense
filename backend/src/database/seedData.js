import bcrypt from 'bcryptjs';

export const getSeedData = async () => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);
  const adminPasswordHash = await bcrypt.hash('admin123', salt);
  const staffPasswordHash = await bcrypt.hash('staff123', salt);
  const residentPasswordHash = await bcrypt.hash('resident123', salt);

  const users = [
    {
      _id: '65f000000000000000000001',
      name: 'Dr. Neha Verma',
      email: 'admin@hydrosense.io',
      password: adminPasswordHash,
      phone: '+91 98401 23456',
      role: 'admin',
      building: 'Admin Tower',
      zone: 'Central Zone',
      unitNumber: 'HQ-101',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      _id: '65f000000000000000000002',
      name: 'Rajesh Kumar',
      email: 'staff@hydrosense.io',
      password: staffPasswordHash,
      phone: '+91 98765 43210',
      role: 'staff',
      building: 'Maintenance Hub',
      zone: 'Zone 1 & 2',
      unitNumber: 'MT-02',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      _id: '65f000000000000000000003',
      name: 'Aditya Sharma',
      email: 'resident@hydrosense.io',
      password: residentPasswordHash,
      phone: '+91 91234 56789',
      role: 'resident',
      building: 'Block A',
      zone: 'North Zone',
      unitNumber: 'A-302',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    },
    {
      _id: '65f000000000000000000004',
      name: 'Priya Sundar',
      email: 'priya@hydrosense.io',
      password: residentPasswordHash,
      phone: '+91 92345 67890',
      role: 'resident',
      building: 'Block C',
      zone: 'East Zone',
      unitNumber: 'C-204',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'
    },
    {
      _id: '65f000000000000000000005',
      name: 'Suresh Patel',
      email: 'suresh.staff@hydrosense.io',
      password: staffPasswordHash,
      phone: '+91 93456 78901',
      role: 'staff',
      building: 'Maintenance Hub',
      zone: 'Zone 3 & 4',
      unitNumber: 'MT-05',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const buildings = [
    {
      _id: '65f000000000000000000011',
      name: 'Block A - Lotus Wing',
      code: 'BLK-A',
      zone: 'North Zone',
      capacity: 30000,
      currentStorage: 22400,
      occupancy: 420,
      status: 'NORMAL',
      coordinates: { lat: 13.0850, lng: 80.2700 },
      dailyAverage: 5400
    },
    {
      _id: '65f000000000000000000012',
      name: 'Block B - Emerald Wing',
      code: 'BLK-B',
      zone: 'West Zone',
      capacity: 35000,
      currentStorage: 18200,
      occupancy: 480,
      status: 'HIGH USAGE',
      coordinates: { lat: 13.0825, lng: 80.2680 },
      dailyAverage: 7100
    },
    {
      _id: '65f000000000000000000013',
      name: 'Block C - Sapphire Wing',
      code: 'BLK-C',
      zone: 'East Zone',
      capacity: 25000,
      currentStorage: 14200,
      occupancy: 390,
      status: 'POSSIBLE LEAK',
      coordinates: { lat: 13.0815, lng: 80.2745 },
      dailyAverage: 8200
    },
    {
      _id: '65f000000000000000000014',
      name: 'Block D - Coral Wing',
      code: 'BLK-D',
      zone: 'South Zone',
      capacity: 28000,
      currentStorage: 21500,
      occupancy: 360,
      status: 'NORMAL',
      coordinates: { lat: 13.0780, lng: 80.2710 },
      dailyAverage: 4800
    },
    {
      _id: '65f000000000000000000015',
      name: 'Block E - Crystal Wing',
      code: 'BLK-E',
      zone: 'Central Zone',
      capacity: 20000,
      currentStorage: 5800,
      occupancy: 280,
      status: 'LOW STORAGE',
      coordinates: { lat: 13.0835, lng: 80.2725 },
      dailyAverage: 3900
    }
  ];

  const complaints = [
    {
      _id: '65f000000000000000000021',
      complaintId: 'CMP-2026-1048',
      userId: '65f000000000000000000004',
      userName: 'Priya Sundar',
      userEmail: 'priya@hydrosense.io',
      category: 'Pipeline Leakage',
      title: 'Continuous Water Gushing from Main Riser in Floor 2 Staircase',
      description: 'Major leak observed on the main pipeline behind the fire riser box on 2nd floor, water pooling towards elevator lobby.',
      location: 'Block C – Floor 2 Staircase A',
      building: 'Block C',
      zone: 'East Zone',
      coordinates: { lat: 13.0816, lng: 80.2744 },
      images: [
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=600&auto=format&fit=crop&q=80'
      ],
      priority: 'CRITICAL',
      status: 'Assigned',
      assignedStaff: '65f000000000000000000002',
      assignedStaffName: 'Rajesh Kumar',
      resolutionNotes: 'Valve isolated temporarily. Sourcing 2-inch CPVC connector replacement.',
      resolutionImage: '',
      timeline: [
        {
          status: 'Submitted',
          message: 'Complaint submitted by Priya Sundar (Unit C-204)',
          updatedBy: 'Priya Sundar',
          timestamp: new Date(Date.now() - 3 * 3600 * 1000)
        },
        {
          status: 'Under Review',
          message: 'Automated AI prioritization set to CRITICAL due to keywords and leak correlation',
          updatedBy: 'System AI Engine',
          timestamp: new Date(Date.now() - 2.8 * 3600 * 1000)
        },
        {
          status: 'Assigned',
          message: 'Dispatched to Senior Plumber Rajesh Kumar',
          updatedBy: 'Dr. Neha Verma (Admin)',
          timestamp: new Date(Date.now() - 2 * 3600 * 1000)
        }
      ],
      createdAt: new Date(Date.now() - 3 * 3600 * 1000),
      updatedAt: new Date(Date.now() - 2 * 3600 * 1000)
    },
    {
      _id: '65f000000000000000000022',
      complaintId: 'CMP-2026-1042',
      userId: '65f000000000000000000003',
      userName: 'Aditya Sharma',
      userEmail: 'resident@hydrosense.io',
      category: 'Low Water Pressure',
      title: 'Low Tap Flow in Master Bathroom',
      description: 'Flow pressure dropped below 0.8 bar since yesterday morning. Kitchen tap is fine, only master bath aerator seems clogged or line choked.',
      location: 'Block A – Flat A-302',
      building: 'Block A',
      zone: 'North Zone',
      coordinates: { lat: 13.0851, lng: 80.2702 },
      images: [],
      priority: 'MEDIUM',
      status: 'In Progress',
      assignedStaff: '65f000000000000000000002',
      assignedStaffName: 'Rajesh Kumar',
      resolutionNotes: 'Pressure regulator valve tested. Inspecting inlet filter cartridge.',
      resolutionImage: '',
      timeline: [
        {
          status: 'Submitted',
          message: 'Complaint filed by Aditya Sharma',
          updatedBy: 'Aditya Sharma',
          timestamp: new Date(Date.now() - 28 * 3600 * 1000)
        },
        {
          status: 'Assigned',
          message: 'Assigned to Rajesh Kumar',
          updatedBy: 'Admin',
          timestamp: new Date(Date.now() - 20 * 3600 * 1000)
        },
        {
          status: 'In Progress',
          message: 'Rajesh Kumar arrived at site and commenced pressure inspection',
          updatedBy: 'Rajesh Kumar',
          timestamp: new Date(Date.now() - 4 * 3600 * 1000)
        }
      ],
      createdAt: new Date(Date.now() - 28 * 3600 * 1000),
      updatedAt: new Date(Date.now() - 4 * 3600 * 1000)
    },
    {
      _id: '65f000000000000000000023',
      complaintId: 'CMP-2026-0988',
      userId: '65f000000000000000000003',
      userName: 'Aditya Sharma',
      userEmail: 'resident@hydrosense.io',
      category: 'Tank Overflow',
      title: 'Overhead Tank Float Sensor Stuck Causing Overflow',
      description: 'Overhead reserve tank overflowed onto terrace roof garden during early morning pumping cycle.',
      location: 'Block A – Rooftop Tank Section',
      building: 'Block A',
      zone: 'North Zone',
      coordinates: { lat: 13.0849, lng: 80.2699 },
      images: [],
      priority: 'HIGH',
      status: 'Resolved',
      assignedStaff: '65f000000000000000000005',
      assignedStaffName: 'Suresh Patel',
      resolutionNotes: 'Replaced faulty brass mechanical float switch with dual magnetic level sensor. Sensor calibrated and tested.',
      resolutionImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
      timeline: [
        {
          status: 'Submitted',
          message: 'Complaint submitted by resident',
          updatedBy: 'Aditya Sharma',
          timestamp: new Date(Date.now() - 72 * 3600 * 1000)
        },
        {
          status: 'In Progress',
          message: 'Staff Suresh replaced float switch',
          updatedBy: 'Suresh Patel',
          timestamp: new Date(Date.now() - 48 * 3600 * 1000)
        },
        {
          status: 'Resolved',
          message: 'Tank automation verified. No spillover detected.',
          updatedBy: 'Suresh Patel',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000)
        }
      ],
      createdAt: new Date(Date.now() - 72 * 3600 * 1000),
      updatedAt: new Date(Date.now() - 24 * 3600 * 1000),
      resolvedAt: new Date(Date.now() - 24 * 3600 * 1000)
    }
  ];

  const leakAlerts = [
    {
      _id: '65f000000000000000000031',
      location: 'Block C – Floor 2',
      building: 'Block C',
      zone: 'East Zone',
      coordinates: { lat: 13.0815, lng: 80.2745 },
      consumption: 480,
      normalAverage: 145,
      anomalyScore: -0.214,
      leakProbability: 0.91,
      severity: 'HIGH',
      status: 'Active',
      assignedStaff: '65f000000000000000000002',
      assignedStaffName: 'Rajesh Kumar',
      recommendedAction: 'Inspect the water pipeline in Block C immediately.',
      notes: 'Isolation Forest flagged sudden 331% jump in flow rate with no corresponding increase in residential occupancy.',
      detectedAt: new Date(Date.now() - 2.5 * 3600 * 1000)
    },
    {
      _id: '65f000000000000000000032',
      location: 'Block B – Basement Pump Room',
      building: 'Block B',
      zone: 'West Zone',
      coordinates: { lat: 13.0825, lng: 80.2680 },
      consumption: 320,
      normalAverage: 180,
      anomalyScore: -0.118,
      leakProbability: 0.74,
      severity: 'MEDIUM',
      status: 'Investigating',
      assignedStaff: '65f000000000000000000005',
      assignedStaffName: 'Suresh Patel',
      recommendedAction: 'Check check-valve and pressure relief manifold for slow weeping leak.',
      notes: 'Slight nocturnal flow recorded between 02:00 and 04:30 AM.',
      detectedAt: new Date(Date.now() - 8 * 3600 * 1000)
    }
  ];

  const demandPredictions = [
    {
      _id: '65f000000000000000000041',
      location: 'Central Campus Grid',
      date: new Date(Date.now() + 24 * 3600 * 1000).toISOString().split('T')[0],
      predictedDemand: 18500,
      actualDemand: null,
      currentAvailable: 14200,
      storageCapacity: 25000,
      expectedShortage: 4300,
      riskLevel: 'HIGH',
      daysRemaining: 1.1,
      recommendation: 'Predicted demand tomorrow is 18,500 L vs 14,200 L current storage. High shortage risk! Increase storage buffer by approx 4,500 L before 06:00 AM.',
      createdAt: new Date()
    }
  ];

  const notifications = [
    {
      _id: '65f000000000000000000051',
      userId: null,
      targetRole: 'admin',
      title: '🚨 CRITICAL AI ALERT: Possible Pipeline Leak in Block C',
      message: 'Abnormal consumption of 480 L/hr detected (Normal: 145 L/hr). 91% leak probability calculated by Isolation Forest.',
      type: 'leak',
      priority: 'critical',
      read: false,
      droppyMood: 'alert',
      createdAt: new Date(Date.now() - 2.5 * 3600 * 1000)
    },
    {
      _id: '65f000000000000000000052',
      userId: null,
      targetRole: 'admin',
      title: '⚠️ High Water Shortage Risk Predicted for Tomorrow',
      message: 'Demand model projects 18,500 L required tomorrow with 4,300 L anticipated deficit. Plan refill schedule.',
      type: 'shortage',
      priority: 'high',
      read: false,
      droppyMood: 'warning',
      createdAt: new Date(Date.now() - 5 * 3600 * 1000)
    },
    {
      _id: '65f000000000000000000053',
      userId: '65f000000000000000000002',
      targetRole: 'staff',
      title: '🔧 New Task Assigned: Pipe Burst at Block C Floor 2',
      message: 'Urgent priority complaint CMP-2026-1048 assigned to you. Location: Block C Floor 2 Staircase.',
      type: 'maintenance',
      priority: 'high',
      read: false,
      droppyMood: 'alert',
      createdAt: new Date(Date.now() - 2 * 3600 * 1000)
    },
    {
      _id: '65f000000000000000000054',
      userId: '65f000000000000000000003',
      targetRole: 'resident',
      title: '💧 Water Saving Insight: Great Job this Week!',
      message: 'Your personal unit consumption decreased by 8% compared to last week! Keep up the eco-habits.',
      type: 'tip',
      priority: 'low',
      read: false,
      droppyMood: 'celebrate',
      createdAt: new Date(Date.now() - 12 * 3600 * 1000)
    },
    {
      _id: '65f000000000000000000055',
      userId: '65f000000000000000000003',
      targetRole: 'resident',
      title: 'ℹ️ Scheduled Overhead Tank Maintenance',
      message: 'Routine sanitization of Block A rooftop tanks will be carried out tomorrow between 14:00 and 16:00.',
      type: 'alert',
      priority: 'medium',
      read: true,
      droppyMood: 'happy',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000)
    }
  ];

  // Generate 14 days of realistic consumption data
  const waterConsumption = [];
  const now = new Date();
  const buildingsList = ['Block A', 'Block B', 'Block C', 'Block D', 'Block E'];

  for (let dayOffset = 14; dayOffset >= 0; dayOffset--) {
    for (let hour = 0; hour < 24; hour += 2) {
      const d = new Date(now.getTime() - (dayOffset * 24 + (24 - hour)) * 3600 * 1000);
      buildingsList.forEach((bName, idx) => {
        // Base consumption profile
        const isPeak = (hour >= 6 && hour <= 9) || (hour >= 18 && hour <= 21);
        const base = isPeak ? 220 + idx * 30 : 90 + idx * 20;
        let reading = base + Math.floor(Math.sin(hour) * 25);

        // Inject the Block C leak in the last 2 days
        let isAnomaly = false;
        if (bName === 'Block C' && dayOffset <= 1) {
          reading = Math.floor(reading * 2.8) + 80;
          isAnomaly = true;
        }

        waterConsumption.push({
          meterId: `MTR-${bName.replace(' ', '')}-${hour.toString().padStart(2, '0')}`,
          location: `${bName} Main Inlet`,
          building: bName,
          zone: ['North Zone', 'West Zone', 'East Zone', 'South Zone', 'Central Zone'][idx],
          timestamp: d,
          consumption: reading,
          flowRate: +(reading / 11.2).toFixed(1),
          source: 'Municipal + Borewell',
          isAnomaly
        });
      });
    }
  }

  return {
    users,
    buildings,
    complaints,
    leakAlerts,
    demandPredictions,
    notifications,
    waterConsumption
  };
};
