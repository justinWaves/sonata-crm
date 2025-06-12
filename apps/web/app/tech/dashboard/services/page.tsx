'use client';
import { useState, useEffect } from 'react';
import PencilIcon from '@/components/PencilIcon';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<null | any>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    fetch('/api/service-types')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      price: parseFloat(formData.get('price') as string),
      duration: formData.get('duration'),
    };

    try {
      const response = await fetch('/api/service-types' + (editing?.id ? `/${editing.id}` : ''), {
        method: editing?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editing?.id ? { ...data, id: editing.id } : data),
      });

      if (!response.ok) throw new Error('Failed to save service');
      
      fetchServices();
      setEditing(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Failed to save service. Please try again.');
    }
  };

  const handleAddNew = () => {
    setIsAdding(true);
    setEditing({
      name: '',
      description: '',
      price: '',
      duration: '',
    });
  };

  return (
    <div className="p-8 relative">
      <h2 className="text-2xl font-bold mb-4">Services</h2>
      <div className="bg-white rounded shadow p-6">
        <button 
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={handleAddNew}
        >
          Add New Service
        </button>
        {loading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th></th>
                <th className="py-2">Service</th>
                <th className="py-2">Description</th>
                <th className="py-2 text-right">Price</th>
                <th className="py-2 text-right">Duration</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="group hover:bg-gray-50">
                  <td className="pr-2 align-middle">
                    <button
                      aria-label="Edit"
                      onClick={() => {
                        setEditing(service);
                        setIsAdding(false);
                      }}
                      className="opacity-70 group-hover:opacity-100 hover:text-blue-600 transition"
                    >
                      <PencilIcon />
                    </button>
                  </td>
                  <td className="py-2">{service.name}</td>
                  <td className="py-2">{service.description}</td>
                  <td className="py-2 text-right font-medium">{formatPrice(service.price)}</td>
                  <td className="py-2 text-right">{service.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {(editing || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {
            setEditing(null);
            setIsAdding(false);
          }} />
          <div className="relative bg-white rounded-lg shadow-lg p-8 w-full max-w-md z-10">
            <h3 className="text-xl font-bold mb-4">{isAdding ? 'Add New Service' : 'Edit Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Service Name</label>
                <input 
                  name="name"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  value={editing.name} 
                  onChange={(e) => setEditing({...editing, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input 
                  name="description"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  value={editing.description} 
                  onChange={(e) => setEditing({...editing, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input 
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  value={editing.price} 
                  onChange={(e) => setEditing({...editing, price: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input 
                  name="duration"
                  className="w-full border border-gray-300 rounded px-3 py-2" 
                  value={editing.duration} 
                  onChange={(e) => setEditing({...editing, duration: e.target.value})}
                  placeholder="e.g., 1.5 hr"
                  required
                />
              </div>
              <div className="flex gap-2 mt-6">
                <button 
                  type="button" 
                  className="w-1/2 border border-gray-300 rounded py-2 hover:bg-gray-50 transition" 
                  onClick={() => {
                    setEditing(null);
                    setIsAdding(false);
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition"
                >
                  {isAdding ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 