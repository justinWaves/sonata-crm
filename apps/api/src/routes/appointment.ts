import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get appointments for a technician
router.get('/', async (req, res) => {
  try {
    const { technicianId } = req.query;
    if (!technicianId) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    const appointments = await prisma.appointment.findMany({
      where: { technicianId: String(technicianId) },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            address: true,
          },
        },
        piano: {
          select: {
            type: true,
            brand: true,
            model: true,
          },
        },
        serviceType: true,
        timeSlot: true,
      },
      orderBy: { scheduledAt: 'asc' },
    });
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// Create a new appointment
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      pianoId,
      serviceTypeId,
      scheduledAt,
      timeSlot,
      notes,
      technicianId,
    } = req.body;

    const appointment = await prisma.appointment.create({
      data: {
        customerId,
        pianoId,
        serviceTypeId,
        scheduledAt: new Date(scheduledAt),
        timeSlot,
        notes,
        technicianId,
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            address: true,
          },
        },
        piano: {
          select: {
            type: true,
            brand: true,
            model: true,
          },
        },
        serviceType: true,
      },
    });
    res.json(appointment);
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Update an appointment
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerId,
      pianoId,
      serviceTypeId,
      scheduledAt,
      timeSlot,
      notes,
      technicianId,
    } = req.body;

    const appointment = await prisma.appointment.update({
      where: { id },
      data: {
        customerId,
        pianoId,
        serviceTypeId,
        scheduledAt: new Date(scheduledAt),
        timeSlot,
        notes,
        technicianId,
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            address: true,
          },
        },
        piano: {
          select: {
            type: true,
            brand: true,
            model: true,
          },
        },
        serviceType: true,
      },
    });
    res.json(appointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
});

// Delete an appointment
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.appointment.delete({
      where: { id },
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting appointment:', err);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router; 