import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const technician = await prisma.technician.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      websiteURL: true,
      customMessage: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!technician) {
    return NextResponse.json({ error: 'Technician not found' }, { status: 404 });
  }
  return NextResponse.json(technician);
} 


