import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const data = await request.json();
  const res = await fetch(`http://localhost:4000/service-types/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
  
  const updatedService = await res.json();
  return NextResponse.json(updatedService);
} 