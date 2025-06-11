import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a technician with custom message and service prices
  const technician = await prisma.technician.create({
    data: {
      name: 'Justin Waves',
      email: 'justin@example.com',
      phone: '555-1234',
      customMessage: 'Thank you for booking with Sonata Piano Works!',
      servicePrices: {
        "Standard Tuning": 195,
        "Touch-Up Tuning": 120,
        "Minor Repair": 150,
        "Major Repair": 275
      },
    },
  });

  // Add some service areas for the technician
  await prisma.serviceArea.createMany({
    data: [
      { zipCode: '95060', technicianId: technician.id },
      { zipCode: '95062', technicianId: technician.id },
    ],
  });

  // Create service types
  await prisma.serviceType.createMany({
    data: [
      { name: 'Standard Tuning', description: 'Basic tuning service' },
      { name: 'Touch-Up Tuning', description: 'Quick tuning after pitch adjustment' },
      { name: 'Minor Repair', description: 'Fixes to small mechanical issues' },
      { name: 'Major Repair', description: 'Larger repair tasks including action part replacements' },
      { name: 'Lubrication', description: 'Lubricate moving parts for better feel and longevity' },
    ],
  });

  const standardTuning = await prisma.serviceType.findUnique({
    where: { name: 'Standard Tuning' },
  });

  if (!standardTuning) {
    throw new Error('Standard Tuning service type not found');
  }

  // Create a customer
  const customer = await prisma.customer.create({
    data: {
      techId: technician.id,
      name: 'Jane Doe',
      phone: '555-5678',
      email: 'jane@example.com',
      address: '123 Piano Street, Santa Cruz, CA',
      referralCode: 'REF2025',
    },
  });

  // Create a piano
  const piano = await prisma.piano.create({
    data: {
      customerId: customer.id,
      type: 'Grand',
      brand: 'Yamaha',
      model: 'C3',
      year: 1995,
      serialNumber: 'YC312345',
      lastServiceDate: new Date('2024-12-01'),
      notes: 'Slight buzzing on lower register',
    },
  });

  // Create a service record (historical)
  await prisma.service.create({
    data: {
      techId: technician.id,
      customerId: customer.id,
      pianoId: piano.id,
      serviceTypeId: standardTuning.id,
      notes: 'Performed standard tuning and adjusted sustain pedal.',
    },
  });

  // Create an upcoming appointment
  await prisma.appointment.create({
    data: {
      technicianId: technician.id,
      customerId: customer.id,
      pianoId: piano.id,
      serviceTypeId: standardTuning.id,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3 days from now
      timeSlot: 'Morning',
      notes: 'Client prefers early morning slots. Bring tools for pedal check.',
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
