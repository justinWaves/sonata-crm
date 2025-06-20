import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get weekly schedule for a technician
router.get('/', async (req, res) => {
  try {
    const { technicianId } = req.query;
    if (!technicianId) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    const weeklySchedule = await prisma.weeklySchedule.findMany({
      where: { technicianId: String(technicianId) },
      orderBy: { dayOfWeek: 'asc' },
    });
    res.json(weeklySchedule);
  } catch (err) {
    console.error('Error fetching weekly schedule:', err);
    res.status(500).json({ error: 'Failed to fetch weekly schedule' });
  }
});

// Update weekly schedule for a technician
router.put('/', async (req, res) => {
  try {
    const scheduleData = req.body;
    if (!Array.isArray(scheduleData)) {
      return res.status(400).json({ error: 'Invalid schedule data' });
    }

    // Delete existing weekly schedule for the technician
    const technicianId = scheduleData[0]?.technicianId;
    if (!technicianId) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    await prisma.weeklySchedule.deleteMany({
      where: { technicianId: String(technicianId) },
    });

    // Create new weekly schedule entries
    const weeklySchedule = await prisma.weeklySchedule.createMany({
      data: scheduleData.map(data => ({
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
        duration: data.duration,
        blockName: data.blockName,
        isAvailable: data.isAvailable,
        technicianId: String(data.technicianId),
      })),
    });

    res.json(weeklySchedule);
  } catch (err) {
    console.error('Error updating weekly schedule:', err);
    res.status(500).json({ error: 'Failed to update weekly schedule' });
  }
});

export default router; 