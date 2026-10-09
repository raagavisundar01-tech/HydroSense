import express from 'express';
import { NotificationRepo } from '../models/dal.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/notifications
router.get('/', protect, async (req, res) => {
  try {
    const userRole = req.user.role;
    const userId = req.user._id.toString();

    const all = await NotificationRepo.find({}, { createdAt: -1 });
    // Filter for current user or user's role or global
    const userNotifications = all.filter(n => {
      if (n.userId && n.userId.toString() === userId) return true;
      if (n.targetRole === 'all') return true;
      if (n.targetRole === userRole) return true;
      return false;
    });

    const unreadCount = userNotifications.filter(n => !n.read).length;
    res.json({ count: userNotifications.length, unreadCount, notifications: userNotifications });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err.message });
  }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', protect, async (req, res) => {
  try {
    const updated = await NotificationRepo.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read', notification: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark notification as read', error: err.message });
  }
});

// PUT /api/notifications/mark-all-read
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    const all = await NotificationRepo.find();
    for (const n of all) {
      if (!n.read) {
        await NotificationRepo.findByIdAndUpdate(n._id, { read: true });
      }
    }
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to mark all as read', error: err.message });
  }
});

// POST /api/notifications/trigger-demo - Trigger an animated water mascot cartoon notification!
router.post('/trigger-demo', protect, async (req, res) => {
  try {
    const { type = 'leak', message, title, mood } = req.body;

    const moodMap = {
      leak: {
        title: '🚨 Pipe Anomaly Flagged!',
        message: 'Droppy noticed sudden spike in water usage in Block C! Leak probability is 92%.',
        mood: 'alert',
        priority: 'critical'
      },
      shortage: {
        title: '⚠️ Water Shortage Alert!',
        message: 'Storage levels projected to dip below safety margin tomorrow morning. Refill requested!',
        mood: 'warning',
        priority: 'high'
      },
      tip: {
        title: '💧 Droppy\'s Conservation Tip',
        message: 'Turning off the tap during soaping saves up to 6 litres of water every minute!',
        mood: 'happy',
        priority: 'low'
      },
      resolved: {
        title: '🎉 Issue Resolved!',
        message: 'Plumbing repair for ticket CMP-2026-1048 is complete! Pressure restored to normal.',
        mood: 'celebrate',
        priority: 'medium'
      }
    };

    const chosen = moodMap[type] || moodMap.leak;
    const newNotif = await NotificationRepo.create({
      userId: req.user._id,
      targetRole: req.user.role,
      title: title || chosen.title,
      message: message || chosen.message,
      type: type === 'resolved' ? 'maintenance' : type,
      priority: chosen.priority,
      read: false,
      droppyMood: mood || chosen.mood
    });

    res.status(201).json({
      message: 'Demo water mascot notification created!',
      notification: newNotif
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to trigger demo notification', error: err.message });
  }
});

export default router;
