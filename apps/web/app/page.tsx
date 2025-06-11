// apps/web/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

type Customer = {
  id: string;
  name: string;
  phone: string;
  email?: string;
};

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    axios.get('http://localhost:4000/customers')
      .then(res => setCustomers(res.data))
      .catch(err => console.error('Error fetching customers:', err));
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Customer List</h1>
      <ul className="space-y-2">
        {customers.map((cust) => (
          <li key={cust.id} className="p-2 border rounded">
            <p><strong>Name:</strong> {cust.name}</p>
            <p><strong>Phone:</strong> {cust.phone}</p>
            <p><strong>Email:</strong> {cust.email || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
