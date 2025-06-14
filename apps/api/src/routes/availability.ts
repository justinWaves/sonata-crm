import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get availability for a technician
router.get('/', async (req, res) => {
  try {
    const { technicianId } = req.query;
    if (!technicianId) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    const availability = await prisma.availability.findMany({
      where: { techId: String(technicianId) },
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(availability);
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
});

// Update availability for a technician
router.put('/', async (req, res) => {
  try {
    const availabilityData = req.body;
    if (!Array.isArray(availabilityData)) {
      return res.status(400).json({ error: 'Invalid availability data' });
    }

    // Delete existing availability for the technician
    const technicianId = availabilityData[0]?.technicianId;
    if (!technicianId) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    await prisma.availability.deleteMany({
      where: { techId: technicianId },
    });

    // Create new availability entries
    const availability = await prisma.availability.createMany({
      data: availabilityData.map(data => ({
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        endTime: data.endTime,
        techId: data.technicianId,
      })),
    });

    res.json(availability);
  } catch (err) {
    console.error('Error updating availability:', err);
    res.status(500).json({ error: 'Failed to update availability' });
  }
});

export default router; 