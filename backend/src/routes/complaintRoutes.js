import express from 'express';
import { ComplaintRepo, UserRepo, NotificationRepo } from '../models/dal.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Calculate priority automatically based on category, keywords, and description
const calculateAutoPriority = (category, description, title) => {
  const text = `${title} ${description}`.toLowerCase();

  const criticalKeywords = ['burst', 'gushing', 'flood', 'flooding', 'major leak', 'emergency', 'collapsed', 'danger', 'main riser'];
  const highKeywords = ['overflow', 'no water', 'contamination', 'black water', 'smell', 'sewage', 'pressure zero', 'damaged'];

  if (criticalKeywords.some(kw => text.includes(kw)) || category === 'Pipeline Leakage') {
    return 'CRITICAL';
  }
  if (highKeywords.some(kw => text.includes(kw)) || category === 'Tank Overflow' || category === 'No Water Supply') {
    return 'HIGH';
  }
  if (category === 'Low Water Pressure' || category === 'Water Quality Issue' || category === 'Drainage Issue') {
    return 'MEDIUM';
  }
  return 'LOW';
};

// GET /api/complaints
router.get('/', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === 'resident') {
      filter = { userId: req.user._id };
    } else if (req.user.role === 'staff') {
      // Staff sees complaints assigned to them, or unassigned high/critical complaints
      const all = await ComplaintRepo.find({}, { createdAt: -1 });
      const filtered = all.filter(c =>
        (c.assignedStaff && c.assignedStaff.toString() === req.user._id.toString()) ||
        (!c.assignedStaff && ['HIGH', 'CRITICAL'].includes(c.priority)) ||
        c.status !== 'Closed'
      );
      return res.json({ complaints: filtered });
    }
    const complaints = await ComplaintRepo.find(filter, { createdAt: -1 });
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});

// GET /api/complaints/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const complaint = await ComplaintRepo.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    // Verify access
    if (req.user.role === 'resident' && complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied to this complaint' });
    }
    res.json({ complaint });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load complaint', error: err.message });
  }
});

// POST /api/complaints - Submit complaint
router.post('/', protect, async (req, res) => {
  try {
    const { category, title, description, location, building, zone, images, coordinates } = req.body;

    if (!category || !title || !description || !location) {
      return res.status(400).json({ message: 'Please fill in category, title, description, and location.' });
    }

    const priority = calculateAutoPriority(category, description, title);
    const complaintId = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newComplaint = await ComplaintRepo.create({
      complaintId,
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      category,
      title,
      description,
      location,
      building: building || req.user.building || 'Block A',
      zone: zone || req.user.zone || 'North Zone',
      coordinates: coordinates || { lat: 13.0827, lng: 80.2707 },
      images: images || [],
      priority,
      status: 'Submitted',
      timeline: [
        {
          status: 'Submitted',
          message: `Ticket lodged by resident ${req.user.name}`,
          updatedBy: req.user.name,
          timestamp: new Date()
        },
        {
          status: 'Under Review',
          message: `HydroSense AI evaluated issue severity and assigned priority: ${priority}`,
          updatedBy: 'AI Priority Classifier',
          timestamp: new Date()
        }
      ]
    });

    // Create system notification for admins
    await NotificationRepo.create({
      targetRole: 'admin',
      title: `📝 New ${priority} Complaint: ${complaintId}`,
      message: `${req.user.name} reported ${category} in ${building || 'Campus'}: "${title}"`,
      type: 'complaint',
      priority: priority.toLowerCase(),
      droppyMood: priority === 'CRITICAL' ? 'alert' : 'warning'
    });

    res.status(201).json({
      message: 'Complaint submitted successfully',
      complaint: newComplaint
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit complaint', error: err.message });
  }
});

// PUT /api/complaints/:id/assign - Admin assigns maintenance staff
router.put('/:id/assign', protect, authorize('admin'), async (req, res) => {
  try {
    const { staffId } = req.body;
    const staff = await UserRepo.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }

    const complaint = await ComplaintRepo.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const timeline = complaint.timeline || [];
    timeline.push({
      status: 'Assigned',
      message: `Assigned to maintenance technician ${staff.name} (${staff.phone || 'On Duty'})`,
      updatedBy: req.user.name,
      timestamp: new Date()
    });

    const updated = await ComplaintRepo.findByIdAndUpdate(req.params.id, {
      assignedStaff: staff._id,
      assignedStaffName: staff.name,
      status: 'Assigned',
      timeline
    });

    // Notify the staff member
    await NotificationRepo.create({
      userId: staff._id,
      targetRole: 'staff',
      title: `🔧 Task Assigned: ${complaint.complaintId}`,
      message: `You were assigned ticket ${complaint.complaintId}: ${complaint.title} at ${complaint.location}`,
      type: 'maintenance',
      priority: complaint.priority.toLowerCase(),
      droppyMood: 'alert'
    });

    res.json({ message: 'Staff assigned successfully', complaint: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to assign staff', error: err.message });
  }
});

// PUT /api/complaints/:id/status - Update status (Staff / Admin)
router.put('/:id/status', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { status, notes, resolutionImage } = req.body;
    const complaint = await ComplaintRepo.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const timeline = complaint.timeline || [];
    timeline.push({
      status,
      message: notes || `Status updated to ${status} by ${req.user.name}`,
      updatedBy: req.user.name,
      timestamp: new Date()
    });

    const updates = {
      status,
      timeline,
      ...(notes && { resolutionNotes: notes }),
      ...(resolutionImage && { resolutionImage }),
      ...(status === 'Resolved' && { resolvedAt: new Date() })
    };

    const updated = await ComplaintRepo.findByIdAndUpdate(req.params.id, updates);

    // Notify resident of the update
    if (complaint.userId) {
      await NotificationRepo.create({
        userId: complaint.userId,
        targetRole: 'resident',
        title: `💧 Ticket ${complaint.complaintId} Updated: ${status}`,
        message: `Your complaint "${complaint.title}" is now marked as ${status}. ${notes ? `Note: ${notes}` : ''}`,
        type: 'complaint',
        priority: 'medium',
        droppyMood: status === 'Resolved' ? 'celebrate' : 'happy'
      });
    }

    res.json({ message: 'Complaint status updated', complaint: updated });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
});

export default router;
