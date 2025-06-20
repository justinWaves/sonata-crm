import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_URL}/schedule-exceptions?technicianId=${session.user.id}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error fetching schedule exceptions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedule exceptions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const res = await fetch(`${API_URL}/schedule-exceptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await res.json();
    return NextResponse.json(responseData, { status: res.status });
  } catch (error) {
    console.error('Error creating schedule exception:', error);
    return NextResponse.json(
      { error: 'Failed to create schedule exception' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Exception ID is required' }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/schedule-exceptions/${id}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      return NextResponse.json(errorData, { status: res.status });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting schedule exception:', error);
    return NextResponse.json(
      { error: 'Failed to delete schedule exception' },
      { status: 500 }
    );
  }
} 