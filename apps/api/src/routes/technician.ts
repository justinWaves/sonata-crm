import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get technician by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const technician = await prisma.technician.findUnique({
      where: { id },
    });
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    res.json(technician);
  } catch (err) {
    console.error('Error fetching technician:', err);
    res.status(500).json({ error: 'Failed to fetch technician' });
  }
});

// Update technician by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      companyName,
      websiteURL,
      address,
      city,
      state,
      zipCode,
      timezone,
      currency,
    } = req.body;
    const updated = await prisma.technician.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        companyName,
        websiteURL,
        address,
        city,
        state,
        zipCode,
        timezone,
        currency,
      },
    });
    res.json(updated);
  } catch (err) {
    console.error('Error updating technician:', err);
    res.status(500).json({ error: 'Failed to update technician' });
  }
});

// Add authentication endpoint
router.post('/auth', async (req, res) => {
  try {
    console.log('Auth endpoint hit with body:', req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    console.log('Looking for user with email:', email);
    const user = await prisma.technician.findUnique({ where: { email } });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user || user.password !== password) {
      console.log('Password check failed. Expected:', user?.password, 'Got:', password);
      // In production, use hashed passwords!
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('Authentication successful for user:', user.email);
    // Remove password before sending user object
    const { password: _pw, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error('Error authenticating technician:', err);
    res.status(500).json({ error: 'Failed to authenticate' });
  }
});

export default router as Router; 