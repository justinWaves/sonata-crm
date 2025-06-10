import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create a technician
  const technician = await prisma.technician.create({
    data: {
      name: 'Justin Waves',
      email: 'justin@example.com',
      phone: '555-1234',
    },
  });

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

  // Create service types
  const serviceTypes = await prisma.serviceType.createMany({
    data: [
      { name: 'Standard Tuning', description: 'Basic tuning service' },
      { name: 'Touch-Up Tuning', description: 'Quick tuning after pitch adjustment' },
      { name: 'Minor Repair', description: 'Fixes to small mechanical issues' },
      { name: 'Major Repair', description: 'Larger repair tasks including action part replacements' },
      { name: 'Lubrication', description: 'Lubricate moving parts for better feel and longevity' },
      { name: 'Hammer Voicing', description: 'Tone adjustment by reshaping and softening hammers' },
      { name: 'Deep Cleaning', description: 'Internal and external cleaning of the piano' },
      { name: 'Action Calibration', description: 'Refinement of piano action geometry and response' },
    ],
  });

  // Fetch a serviceType to link in a service
  const standardTuning = await prisma.serviceType.findFirst({
    where: { name: 'Standard Tuning' },
  });

  // Create a service entry
  if (standardTuning) {
    await prisma.service.create({
      data: {
        techId: technician.id,
        customerId: customer.id,
        pianoId: piano.id,
        serviceTypeId: standardTuning.id,
        notes: 'Performed standard tuning and minor pedal adjustment.',
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
