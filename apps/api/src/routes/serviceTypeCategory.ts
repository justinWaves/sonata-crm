import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// Update a service type category
router.put('/', async (req, res) => {
  const { oldType, newType, newColor, technicianId } = req.body;

  if (!oldType || !newType || !newColor || !technicianId) {
    return res.status(400).json({ error: 'Missing required fields for category update.' });
  }

  try {
    const result = await prisma.serviceType.updateMany({
      where: {
        technicianId: technicianId,
        serviceType: oldType,
      },
      data: {
        serviceType: newType,
        serviceTypeColor: newColor,
      },
    });
    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Failed to update service type category:', error);
    res.status(500).json({ error: 'Failed to update service type category' });
  }
});

// Delete a service type category (orphan the services)
router.delete('/', async (req, res) => {
  const { type, technicianId } = req.body;

  if (!type || !technicianId) {
    return res.status(400).json({ error: 'Missing required fields for category deletion.' });
  }

  try {
    const result = await prisma.serviceType.updateMany({
      where: {
        technicianId: technicianId,
        serviceType: type,
      },
      data: {
        serviceType: '',
        serviceTypeColor: '',
      },
    });
    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error('Failed to delete service type category:', error);
    res.status(500).json({ error: 'Failed to delete service type category' });
  }
});

export default router; 