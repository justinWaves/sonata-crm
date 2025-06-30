import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { ids } = await request.json();
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No IDs provided' }, { status: 400 });
    }
    // Call the backend API for each id (could be optimized in the backend)
    const results = await Promise.all(ids.map(async (id: string) => {
      const res = await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
      return res.ok;
    }));
    if (results.every(Boolean)) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Some deletes failed' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to bulk delete customers' }, { status: 500 });
  }
} 