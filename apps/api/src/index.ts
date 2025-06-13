// apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/customers', async (req, res) => {
  try {
    const customers = await prisma.customer.findMany();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

app.get('/service-types', async (req, res) => {
  try {
    const { technicianId } = req.query;
    const serviceTypes = await prisma.serviceType.findMany({
      where: technicianId ? {
        technicianId: String(technicianId)
      } : undefined
    });
    res.json(serviceTypes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch service types' });
  }
});

app.post('/service-types', async (req, res) => {
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

app.put('/service-types/:id', async (req, res) => {
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

app.delete('/service-types/:id', async (req, res) => {
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

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Sonata CRM API!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
