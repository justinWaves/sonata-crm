import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const res = await fetch(`${API_URL}/pianos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        technicianId: session.user.id,
      }),
    });
    const responseData = await res.json();
    return NextResponse.json(responseData, { status: res.status });
  } catch (error) {
    console.error('Error creating piano:', error);
    return NextResponse.json(
      { error: 'Failed to create piano' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const res = await fetch(`${API_URL}/pianos/${data.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const responseData = await res.json();
    return NextResponse.json(responseData, { status: res.status });
  } catch (error) {
    console.error('Error updating piano:', error);
    return NextResponse.json(
      { error: 'Failed to update piano' },
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
      return NextResponse.json({ error: 'Piano ID is required' }, { status: 400 });
    }

    const res = await fetch(`${API_URL}/pianos/${id}`, {
      method: 'DELETE',
    });
    const responseData = await res.json();
    return NextResponse.json(responseData, { status: res.status });
  } catch (error) {
    console.error('Error deleting piano:', error);
    return NextResponse.json(
      { error: 'Failed to delete piano' },
      { status: 500 }
    );
  }
} 