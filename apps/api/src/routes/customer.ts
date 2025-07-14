import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get customers for a technician
router.get('/', async (req, res) => {
  try {
    const { technicianId } = req.query;
    if (!technicianId) {
      return res.status(400).json({ error: 'Technician ID is required' });
    }

    const customers = await prisma.customer.findMany({
      where: { techId: String(technicianId) },
      orderBy: { createdAt: 'desc' },
      include: {
        pianos: true
      }
    });
    res.json(customers);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Get a single customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        pianos: true
      }
    });
    
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
});

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      technicianId,
      companyName,
      textUpdates,
      emailUpdates,
      referralCode,
    } = req.body;

    const customer = await prisma.customer.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        techId: technicianId,
        companyName,
        textUpdates,
        emailUpdates,
        referralCode,
      },
    });
    res.json(customer);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: 'Failed to create customer' });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      companyName,
      textUpdates,
      emailUpdates,
    } = req.body;

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        firstName,
        lastName,
        email,
        phone,
        address,
        city,
        state,
        zipCode,
        companyName,
        textUpdates,
        emailUpdates,
      },
      include: { pianos: true }
    });
    res.json(customer);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: 'Failed to update customer' });
  }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete related records first (cascade delete)
    await prisma.$transaction(async (tx) => {
      // Delete appointments for this customer
      await tx.appointment.deleteMany({
        where: { customerId: id }
    });
      
      // Delete services for this customer
      await tx.service.deleteMany({
        where: { customerId: id }
      });
      
      // Delete pianos for this customer (this will also delete related appointments and services)
      await tx.piano.deleteMany({
        where: { customerId: id }
      });
      
      // Finally delete the customer
      await tx.customer.delete({
        where: { id }
      });
    });
    
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
});

export default router; 