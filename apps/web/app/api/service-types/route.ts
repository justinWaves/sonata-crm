import { NextResponse } from 'next/server';

export async function GET() {
  const res = await fetch('http://localhost:4000/service-types');
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const data = await request.json();
  const res = await fetch('http://localhost:4000/service-types', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
  
  const newService = await res.json();
  return NextResponse.json(newService);
}

export async function PUT(request: Request) {
  const data = await request.json();
  const { id, ...serviceData } = data;
  
  const res = await fetch(`http://localhost:4000/service-types/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(serviceData),
  });
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
  
  const updatedService = await res.json();
  return NextResponse.json(updatedService);
} 