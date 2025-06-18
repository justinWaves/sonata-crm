import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const { technicianId } = req.query;
    console.log('Fetching service types, technicianId:', technicianId);
    const serviceTypes = await prisma.serviceType.findMany({
      where: technicianId ? { technicianId: String(technicianId) } : undefined,
    });
    console.log('Service types found:', serviceTypes.length);
    res.json(serviceTypes);
  } catch (err) {
    console.error('Error fetching service types:', err);
    res.status(500).json({ error: 'Failed to fetch service types' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, duration, technicianId } = req.body;
    const serviceType = await prisma.serviceType.create({
      data: {
        name,
        description,
        price: Number(price),
        duration,
        technicianId,
      },
    });
    res.json(serviceType);
  } catch (err) {
    console.error('Error creating service type:', err);
    res.status(500).json({ error: 'Failed to create service type' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration, technicianId } = req.body;
    const serviceType = await prisma.serviceType.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        duration,
        technicianId,
      },
    });
    res.json(serviceType);
  } catch (err) {
    console.error('Error updating service type:', err);
    res.status(500).json({ error: 'Failed to update service type' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.serviceType.delete({
      where: { id },
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting service type:', err);
    res.status(500).json({ error: 'Failed to delete service type' });
  }
});

export default router; 