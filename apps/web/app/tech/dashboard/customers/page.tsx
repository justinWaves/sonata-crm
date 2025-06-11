export default function CustomersPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <div className="bg-white rounded shadow p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th className="py-2">Phone</th>
              <th className="py-2">Email</th>
              <th className="py-2">Zip Code</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">-</td>
              <td className="py-2">-</td>
              <td className="py-2">-</td>
              <td className="py-2">-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 