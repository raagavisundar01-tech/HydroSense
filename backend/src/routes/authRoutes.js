import express from 'express';
import bcrypt from 'bcryptjs';
import { UserRepo } from '../models/dal.js';
import { generateToken, protect } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, role, building, zone, unitNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await UserRepo.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set appropriate location/zone defaults based on role
    let assignedBuilding = building;
    let assignedUnit = unitNumber;
    let assignedZone = zone;

    if (role === 'admin') {
      assignedBuilding = 'Central Operations';
      assignedUnit = 'HQ-Admin';
      assignedZone = 'Campus Wide';
    } else if (role === 'staff') {
      assignedBuilding = 'Maintenance Hub';
      assignedUnit = 'Field Dispatch';
      assignedZone = zone || 'Zone 1 & 2';
    } else {
      assignedBuilding = building || 'Block A';
      assignedUnit = unitNumber || 'A-101';
      assignedZone = zone || 'North Zone';
    }

    const user = await UserRepo.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || '',
      role: role && ['resident', 'staff', 'admin'].includes(role) ? role : 'resident',
      building: assignedBuilding,
      zone: assignedZone,
      unitNumber: assignedUnit,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`
    });

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        building: user.building,
        zone: user.zone,
        unitNumber: user.unitNumber,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await UserRepo.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        building: user.building,
        zone: user.zone,
        unitNumber: user.unitNumber,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

// Profile
router.get('/profile', protect, async (req, res) => {
  const { password, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// Update profile
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, phone, building, zone, unitNumber } = req.body;
    const updated = await UserRepo.findByIdAndUpdate(req.user._id, {
      ...(name && { name }),
      ...(phone && { phone }),
      ...(building && { building }),
      ...(zone && { zone }),
      ...(unitNumber && { unitNumber })
    });
    const { password, ...safeUser } = updated;
    res.json({ message: 'Profile updated successfully', user: safeUser });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
});

// POST /clerk-sync - Synchronize Clerk authentication (Google, OAuth, etc.) with HydroSense
router.post('/clerk-sync', async (req, res) => {
  try {
    const { clerkId, email, name, avatar, role = 'resident' } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required from Clerk session.' });
    }

    let user = await UserRepo.findOne({ email });

    if (!user) {
      return res.status(403).json({ 
        message: 'This Google account is not registered. Please register manually first.' 
      });
    } else {
      // If user exists, update avatar if provided
      if (avatar && avatar !== user.avatar) {
        user = await UserRepo.findByIdAndUpdate(user._id, { avatar }, { new: true }) || user;
      }
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        building: user.building,
        zone: user.zone,
        unitNumber: user.unitNumber,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Clerk synchronization error', error: err.message });
  }
});

export default router;
