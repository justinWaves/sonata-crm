export default function ServicesPage() {
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Services</h2>
      <div className="bg-white rounded shadow p-6">
        <button className="mb-4 px-4 py-2 bg-blue-600 text-white rounded">Add New Service</button>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">Kind</th>
              <th className="py-2">Duration</th>
              <th className="py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">Express Tuning</td>
              <td className="py-2">1 hr</td>
              <td className="py-2">$95</td>
            </tr>
            <tr>
              <td className="py-2">Standard Tuning</td>
              <td className="py-2">1.5 hr</td>
              <td className="py-2">$110</td>
            </tr>
            <tr>
              <td className="py-2">Precision Performance</td>
              <td className="py-2">2 hr</td>
              <td className="py-2">$145</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 