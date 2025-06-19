import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const GET = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const res = await fetch(`${API_URL}/service-types?technicianId=${session.user.id}`);
  const data = await res.json();
  return NextResponse.json(data);
};

export const POST = async (request: Request) => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const data = await request.json();
  const res = await fetch(`${API_URL}/service-types`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      technicianId: session.user.id,
    }),
  });
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
  
  const newService = await res.json();
  return NextResponse.json(newService);
}; 