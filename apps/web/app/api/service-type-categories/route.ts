import { NextResponse } from 'next/server';
import { getSession } from 'next-auth/react';
import { NextApiRequest } from 'next';

async function handler(req: Request) {
  const { method } = req;
  const body = await req.json();

  const technicianId = body.technicianId; // Assuming technicianId is passed in the body

  if (!technicianId) {
    return new NextResponse(JSON.stringify({ error: 'Technician ID is required' }), { status: 401 });
  }

  const backendUrl = 'http://localhost:4000/service-type-categories';

  try {
    const response = await fetch(backendUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return new NextResponse(JSON.stringify({ error: errorData.error || `Failed to ${method} category` }), { status: response.status });
    }

    const data = await response.json();
    return new NextResponse(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}

export { handler as PUT, handler as DELETE }; 