// apps/api/src/index.ts
import express from 'express';
import cors from 'cors';
import serviceTypeRoutes from './routes/serviceType';
import customerRoutes from './routes/customer';
import technicianRoutes from './routes/technician';
import pianoRoutes from './routes/piano';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/service-types', serviceTypeRoutes);
app.use('/customers', customerRoutes);
app.use('/technicians', technicianRoutes);
app.use('/pianos', pianoRoutes);

// Health check / root
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Sonata CRM API!' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
