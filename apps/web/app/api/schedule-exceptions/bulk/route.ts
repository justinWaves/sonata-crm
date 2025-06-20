import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new NextResponse(JSON.stringify({ error: 'Exception IDs are required' }), { status: 400 });
    }

    const deleteResult = await prisma.scheduleException.deleteMany({
      where: {
        id: {
          in: ids,
        },
        technicianId: session.user.id, // Ensure user can only delete their own exceptions
      },
    });

    if (deleteResult.count === 0) {
      // This could mean the exceptions were not found or didn't belong to the user.
      console.log('No exceptions found to delete for user:', session.user.id, 'with IDs:', ids);
    }
    
    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error('Error deleting schedule exceptions:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete schedule exceptions' }), { status: 500 });
  }
} 