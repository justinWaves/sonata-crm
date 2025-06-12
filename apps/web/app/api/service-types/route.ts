import { NextResponse } from 'next/server';

export const GET = async () => {
  const res = await fetch('http://localhost:4000/service-types');
  const data = await res.json();
  return NextResponse.json(data);
};

export const POST = async (request: Request) => {
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
}; 