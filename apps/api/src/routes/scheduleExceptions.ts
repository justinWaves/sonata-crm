import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get schedule exceptions for a technician
router.get('/', async (req, res) => {
  try {
    const { technicianId } = req.query;
    if (!technicianId) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    const scheduleExceptions = await prisma.scheduleException.findMany({
      where: { technicianId: String(technicianId) },
      orderBy: { date: 'asc' },
    });
    res.json(scheduleExceptions);
  } catch (err) {
    console.error('Error fetching schedule exceptions:', err);
    res.status(500).json({ error: 'Failed to fetch schedule exceptions' });
  }
});

// Create a new schedule exception
router.post('/', async (req, res) => {
  try {
    const { technicianId, date, startTime, endTime, isAvailable, reason } = req.body;
    
    if (!technicianId || !date) {
      return res.status(400).json({ error: 'Technician ID and date are required' });
    }

    const scheduleException = await prisma.scheduleException.create({
      data: {
        technicianId: String(technicianId),
        date: new Date(date),
        startTime: startTime || null,
        endTime: endTime || null,
        isAvailable: isAvailable ?? true,
        reason: reason || null,
      },
    });

    res.json(scheduleException);
  } catch (err) {
    console.error('Error creating schedule exception:', err);
    res.status(500).json({ error: 'Failed to create schedule exception' });
  }
});

// Delete a schedule exception
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: 'Exception ID is required' });
    }

    await prisma.scheduleException.delete({
      where: { id: String(id) },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting schedule exception:', err);
    res.status(500).json({ error: 'Failed to delete schedule exception' });
  }
});

export default router; 