"use client";
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Piano {
  id: string;
  type: string;
  brand: string | null;
  year: number | null;
  model: string | null;
  serialNumber: string | null;
  lastServiceDate: string | null;
  notes: string | null;
  customerId: string;
}

export default function PianosPage() {
  const [pianos, setPianos] = useState<Piano[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPianos();
  }, []);

  const fetchPianos = async () => {
    try {
      const response = await fetch('/api/pianos');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch pianos');
      setPianos(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch pianos');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading pianos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pianos</h2>
            <p className="text-base text-gray-500">Manage your piano inventory and service history</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Brand</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Model</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Year</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Last Service</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pianos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      No pianos found
                    </td>
                  </tr>
                ) : (
                  pianos.map((piano) => (
                    <tr 
                      key={piano.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">{piano.type}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">{piano.brand || '-'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{piano.model || '-'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">{piano.year || '-'}</td>
                      <td className="py-4 px-6 text-sm text-gray-900">
                        {piano.lastServiceDate ? new Date(piano.lastServiceDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => {/* TODO: Implement view details */}}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {/* TODO: Implement edit */}}
                            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {/* TODO: Implement add piano */}}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add Piano
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 