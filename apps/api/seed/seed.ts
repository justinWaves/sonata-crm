import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

console.log('Seeding started');

async function main() {
  const defaultPassword = '1234';
  console.log(`Creating default technicians with password: "${defaultPassword}"`);

  // Create a technician with custom message and service prices
  const technician = await prisma.technician.create({
    data: {
      firstName: 'Justin Waves',
      lastName: 'Waves',
      email: 'juhstinn@gmail.com',
      password: defaultPassword,
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
      isPianoTechnician: true,
      isMusicTeacher: false,
      servicePrices: {
        "Standard Tuning": 195,
        "Touch-Up Tuning": 120,
        "Minor Repair": 150,
        "Major Repair": 275
      },
    },
  });

  // --- Third Technician: Music Teacher ---
  const musicTeacher = await prisma.technician.create({
    data: {
      firstName: 'Melody',
      lastName: 'Harmony',
      email: 'melody@example.com',
      password: defaultPassword,
      phone: '555-5555',
      companyName: 'Harmony Music School',
      address: '789 Cadence Ct',
      city: 'Capitola',
      state: 'CA',
      zipCode: '95010',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
      customMessage: 'Excited for our lesson!',
      isPianoTechnician: false,
      isMusicTeacher: true,
    },
  });

  // --- Second Technician: Ron Henderson ---
  const technician2 = await prisma.technician.create({
    data: {
      firstName: 'Ron',
      lastName: 'Henderson',
      email: 'ron@example.com',
      password: defaultPassword,
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
      isPianoTechnician: true,
      isMusicTeacher: false,
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
      { zipCode: '95010', technicianId: musicTeacher.id },
    ],
  });

  // Create service types (assigning technicianId and updatedAt)
  const serviceTypes = [
    { name: 'Standard Tuning', description: 'Basic tuning service', price: 195, duration: '1.5 hr', durationMinutes: 90, bufferMinutes: 15, technicianId: technician.id, updatedAt: new Date(), serviceType: 'Tuning', serviceTypeColor: '#a78bfa' },
    { name: 'Touch-Up Tuning', description: 'Quick tuning after pitch adjustment', price: 120, duration: '1 hr', durationMinutes: 60, bufferMinutes: 10, technicianId: technician.id, updatedAt: new Date(), serviceType: 'Tuning', serviceTypeColor: '#a78bfa' },
    { name: 'Minor Repair', description: 'Fixes to small mechanical issues', price: 150, duration: '1 hr', durationMinutes: 60, bufferMinutes: 15, technicianId: technician.id, updatedAt: new Date(), serviceType: 'Repair', serviceTypeColor: '#fbbf24' },
    { name: 'Major Repair', description: 'Larger repair tasks including action part replacements', price: 275, duration: '2 hr', durationMinutes: 120, bufferMinutes: 30, technicianId: technician2.id, updatedAt: new Date(), serviceType: 'Repair', serviceTypeColor: '#fbbf24' },
    { name: 'Lubrication', description: 'Lubricate moving parts for better feel and longevity', price: 60, duration: '0.5 hr', durationMinutes: 30, bufferMinutes: 5, technicianId: technician2.id, updatedAt: new Date(), serviceType: 'Repair', serviceTypeColor: '#fbbf24' },
    { name: 'Piano Lesson', description: '30-minute piano lesson', price: 50, duration: '0.5 hr', durationMinutes: 30, bufferMinutes: 5, technicianId: musicTeacher.id, updatedAt: new Date(), serviceType: 'Lesson', serviceTypeColor: '#34d399' },
    { name: 'Guitar Lesson', description: '45-minute guitar lesson', price: 65, duration: '0.75 hr', durationMinutes: 45, bufferMinutes: 5, technicianId: musicTeacher.id, updatedAt: new Date(), serviceType: 'Lesson', serviceTypeColor: '#f87171' },
  ];
  for (const st of serviceTypes) {
    await prisma.serviceType.create({ data: st });
  }

  const standardTuning = await prisma.serviceType.findFirst({
    where: { name: 'Standard Tuning' },
  });

  const pianoLesson = await prisma.serviceType.findFirst({
    where: { name: 'Piano Lesson' },
  });

  if (!standardTuning || !pianoLesson) {
    throw new Error('Required service types not found');
  }

  // Create a customer for Justin Waves
  const customer = await prisma.customer.create({
    data: {
      techId: technician.id,
      firstName: 'Jane',
      lastName: 'Doe',
      companyName: 'Doe Family',
      phone: '555-5678',
      email: 'jane@example.com',
      address: '123 Piano Street',
      city: 'Santa Cruz',
      state: 'CA',
      zipCode: '95060',
      referralCode: 'REF2025',
      textUpdates: true,
      emailUpdates: true,
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
      notes: 'Client prefers early morning slots. Bring tools for pedal check.',
    },
  });

  // Create a customer (student) for Melody Harmony
  const student = await prisma.customer.create({
    data: {
      techId: musicTeacher.id,
      firstName: 'Alex',
      lastName: 'Rhythm',
      phone: '555-2468',
      email: 'alex@example.com',
      address: '101 Tempo Lane',
      city: 'Capitola',
      state: 'CA',
      zipCode: '95010',
      textUpdates: true,
      emailUpdates: true,
    },
  });

  // Create an upcoming appointment (lesson) for Alex
  await prisma.appointment.create({
    data: {
      technicianId: musicTeacher.id,
      customerId: student.id,
      serviceTypeId: pianoLesson.id,
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days from now
      notes: 'First lesson, focus on basic scales.',
    },
  });

  // Clear existing weekly schedules to prevent duplicates during re-seeding
  await prisma.weeklySchedule.deleteMany({});

  // Define the time blocks
  const timeBlocks = [
    { blockName: 'Morning', startTime: '09:00', endTime: '11:00' },
    { blockName: 'Afternoon', startTime: '12:30', endTime: '16:30' },
    { blockName: 'Evening', startTime: '17:00', endTime: '19:00' },
  ];

  // Create schedules for Monday to Friday (available)
  for (let day = 1; day <= 5; day++) {
    for (const block of timeBlocks) {
      await prisma.weeklySchedule.create({
        data: {
          technicianId: technician.id,
          dayOfWeek: day,
          isAvailable: true,
          ...block,
        },
      });
    }
  }

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
      companyName: 'Smith Family',
      email: 'sam@example.com',
      address: '456 Music Ave',
      city: 'Aptos',
      state: 'CA',
      zipCode: '95003',
      referralCode: 'REF2026',
      textUpdates: true,
      emailUpdates: true,
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
