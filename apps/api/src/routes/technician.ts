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

// Change password endpoint
router.patch('/:id/password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }
    
    // Get the technician to verify current password
    const technician = await prisma.technician.findUnique({
      where: { id },
    });
    
    if (!technician) {
      return res.status(404).json({ error: 'Technician not found' });
    }
    
    // Verify current password
    if (technician.password.trim() !== currentPassword.trim()) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }
    
    // Update password
    const updated = await prisma.technician.update({
      where: { id },
      data: {
        password: newPassword,
      },
    });
    
    // Remove password from response
    const { password: _pw, ...technicianWithoutPassword } = updated;
    res.json(technicianWithoutPassword);
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ error: 'Failed to change password' });
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
    if (!user || user.password.trim() !== password.trim()) {
      console.log('Password check failed.');
      if (user) {
        console.log(`Expected: '${user.password}' (length: ${user.password.length})`);
        console.log(`Got: '${password}' (length: ${password.length})`);
      } else {
        console.log('User not found in database.');
      }
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