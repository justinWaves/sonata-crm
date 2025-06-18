import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Create a new piano
router.post('/', async (req, res) => {
  try {
    const {
      customerId,
      type,
      brand,
      model,
      year,
      serialNumber,
      notes,
      lastServiceDate,
    } = req.body;

    const piano = await prisma.piano.create({
      data: {
        customerId,
        type,
        brand,
        model,
        year: year ? Number(year) : null,
        serialNumber,
        notes,
        lastServiceDate: lastServiceDate ? new Date(lastServiceDate) : null,
      },
    });
    res.json(piano);
  } catch (err) {
    console.error('Error creating piano:', err);
    res.status(500).json({ error: 'Failed to create piano' });
  }
});

// Update a piano
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      type,
      brand,
      model,
      year,
      serialNumber,
      notes,
      lastServiceDate,
    } = req.body;

    const piano = await prisma.piano.update({
      where: { id },
      data: {
        type,
        brand,
        model,
        year: year ? Number(year) : null,
        serialNumber,
        notes,
        lastServiceDate: lastServiceDate ? new Date(lastServiceDate) : null,
      },
    });
    res.json(piano);
  } catch (err) {
    console.error('Error updating piano:', err);
    res.status(500).json({ error: 'Failed to update piano' });
  }
});

// Delete a piano
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.piano.delete({
      where: { id },
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting piano:', err);
    res.status(500).json({ error: 'Failed to delete piano' });
  }
});

export default router; 