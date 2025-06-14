import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

console.log('Seeding started');

async function main() {
  // Create a technician with custom message and service prices
  const technician = await prisma.technician.create({
    data: {
      firstName: 'Justin Waves',
      lastName: 'Waves',
      email: 'juhstinn@gmail.com',
      password: '1234',
      phone: '555-1234',
      websiteURL: 'https://sonatapianoworks.com',
      companyName: 'Sonata Piano Works',
      address: '123 Piano St',
      city: 'Santa Cruz',
      state: 'CA',
      zipCode: '95060',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      customMessage: 'Thank you for booking with Sonata Piano Works!',
      servicePrices: {
        "Standard Tuning": 195,
        "Touch-Up Tuning": 120,
        "Minor Repair": 150,
        "Major Repair": 275
      },
    },
  });

    // --- Second Technician: Ron Henderson ---
    const technician2 = await prisma.technician.create({
      data: {
        firstName: 'Ron',
        lastName: 'Henderson',
        email: 'ron@example.com',
        password: '1234',
        phone: '555-9876',
        websiteURL: 'https://ronspiano.com',
        companyName: "Ron's Piano Service",
        address: '456 Music Ave',
        city: 'Aptos',
        state: 'CA',
        zipCode: '95003',
        timezone: 'America/Los_Angeles',
        currency: 'USD',
        customMessage: 'Looking forward to servicing your piano! - Ron',
        servicePrices: {
          "Standard Tuning": 180,
          "Touch-Up Tuning": 110,
          "Minor Repair": 140,
          "Major Repair": 260
        },
      },
    });

  // Add some service areas for the technician
  await prisma.serviceArea.createMany({
    data: [
      { zipCode: '95010', technicianId: technician2.id },
      { zipCode: '95003', technicianId: technician2.id },
    ],
  });

  // Create service types (assigning technicianId and updatedAt)
  const serviceTypes = [
    { name: 'Standard Tuning', description: 'Basic tuning service', price: 195, duration: '1.5 hr', technicianId: technician.id, updatedAt: new Date() },
    { name: 'Touch-Up Tuning', description: 'Quick tuning after pitch adjustment', price: 120, duration: '1 hr', technicianId: technician.id, updatedAt: new Date() },
    { name: 'Minor Repair', description: 'Fixes to small mechanical issues', price: 150, duration: '1 hr', technicianId: technician.id, updatedAt: new Date() },
    { name: 'Major Repair', description: 'Larger repair tasks including action part replacements', price: 275, duration: '2 hr', technicianId: technician2.id, updatedAt: new Date() },
    { name: 'Lubrication', description: 'Lubricate moving parts for better feel and longevity', price: 60, duration: '0.5 hr', technicianId: technician2.id, updatedAt: new Date() },
  ];
  for (const st of serviceTypes) {
    await prisma.serviceType.create({ data: st });
  }

  const standardTuning = await prisma.serviceType.findFirst({
    where: { name: 'Standard Tuning' },
  });

  if (!standardTuning) {
    throw new Error('Standard Tuning service type not found');
  }

  // Create a customer for Justin Waves
  const customer = await prisma.customer.create({
    data: {
      techId: technician.id,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '555-5678',
      email: 'jane@example.com',
      address: '123 Piano Street, Santa Cruz, CA',
      referralCode: 'REF2025',
    },
  });

  // Create a piano for Jane
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

  // Create a service record (historical) for Jane
  await prisma.service.create({
    data: {
      techId: technician.id,
      customerId: customer.id,
      pianoId: piano.id,
      serviceTypeId: standardTuning.id,
      notes: 'Performed standard tuning and adjusted sustain pedal.',
    },
  });

  // Create an upcoming appointment for Jane
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



  // Add service areas for Ron
  await prisma.serviceArea.createMany({
    data: [
      { zipCode: '95010', technicianId: technician2.id },
      { zipCode: '95003', technicianId: technician2.id },
    ],
  });

  // Create a customer for Ron
  const customer2 = await prisma.customer.create({
    data: {
      techId: technician2.id,
      firstName: 'Sam',
      lastName: 'Smith',
      phone: '555-4321',
      email: 'sam@example.com',
      address: '456 Music Ave, Aptos, CA',
      referralCode: 'REF2026',
    },
  });

  // Create a piano for Sam
  const piano2 = await prisma.piano.create({
    data: {
      customerId: customer2.id,
      type: 'Upright',
      brand: 'Kawai',
      model: 'K-300',
      year: 2010,
      serialNumber: 'KW987654',
      lastServiceDate: new Date('2024-11-15'),
      notes: 'Sticky key in upper register',
    },
  });

  // Create a service record (historical) for Sam
  await prisma.service.create({
    data: {
      techId: technician2.id,
      customerId: customer2.id,
      pianoId: piano2.id,
      serviceTypeId: standardTuning.id,
      notes: 'Touch-up tuning and minor repair on sticky key.',
    },
  });

  // Create an upcoming appointment for Sam
  await prisma.appointment.create({
    data: {
      technicianId: technician2.id,
      customerId: customer2.id,
      pianoId: piano2.id,
      serviceTypeId: standardTuning.id,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5), // 5 days from now
      timeSlot: 'Afternoon',
      notes: 'Check sticky key and perform standard tuning.',
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

console.log('Seeding complete!');
