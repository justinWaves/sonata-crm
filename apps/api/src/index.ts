// apps/api/src/index.ts
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import serviceTypeRoutes from './routes/serviceType';
import customerRoutes from './routes/customer';
import technicianRoutes from './routes/technician';
import pianoRoutes from './routes/piano';
import availabilityRoutes from './routes/availability';
import scheduleExceptionsRoutes from './routes/scheduleExceptions';
import serviceTypeCategoryRoutes from './routes/serviceTypeCategory';
import appointmentRoutes from './routes/appointment';
import uploadRoutes from './routes/upload';
import { PrismaClient } from '@prisma/client';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/technicians', technicianRoutes);
app.use('/customers', customerRoutes);
app.use('/pianos', pianoRoutes);
app.use('/service-types', serviceTypeRoutes);
app.use('/service-type-categories', serviceTypeCategoryRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/availability', availabilityRoutes);
app.use('/schedule-exceptions', scheduleExceptionsRoutes);
app.use('/upload', uploadRoutes);

// Health check / root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Sonata CRM API!' });
});

// Database connection test
app.get('/db-test', async (req, res) => {
  try {
    console.log('Testing database connection...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('Database connection successful:', result);
    res.json({ 
      message: 'Database connection successful', 
      result,
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ 
      error: 'Database connection failed', 
      details: err instanceof Error ? err.message : 'Unknown error',
      databaseUrl: process.env.DATABASE_URL ? 'Set' : 'Not set'
    });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
