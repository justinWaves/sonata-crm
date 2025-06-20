import { NextResponse } from 'next/server';

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const data = await request.json();
  const res = await fetch(`http://localhost:4000/service-types/${params.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      serviceType: data.serviceType,
      serviceTypeColor: data.serviceTypeColor,
    }),
  });
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
  
  const updatedService = await res.json();
  return NextResponse.json(updatedService);
};

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const res = await fetch(`http://localhost:4000/service-types/${params.id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}; 