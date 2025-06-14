'use client';
import { useState, useEffect, useCallback } from 'react';
import PencilIcon from '@/components/PencilIcon';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  technicianId: string;
}

export default function ServicesPage() {
  const { data: session } = useSession();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchServices = useCallback(async () => {
    try {
      const response = await fetch('/api/service-types');
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch services');
      
      const filteredServices = data.filter((service: ServiceType) => 
        service.technicianId === session?.user?.id
      );
      setServices(filteredServices);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch services');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchServices();
    }
  }, [session, fetchServices]);

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
      technicianId: session?.user?.id,
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
      
      await fetchServices();
      setEditing(null);
      setIsAdding(false);
      toast.success(editing?.id ? 'Service updated successfully' : 'Service added successfully');
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!editing?.id) return;

    try {
      const response = await fetch(`/api/service-types/${editing.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete service');
      
      await fetchServices();
      setEditing(null);
      setIsDeleting(false);
      toast.success('Service deleted successfully');
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service. Please try again.');
    }
  };

  const handleAddNew = () => {
    if (!session?.user?.id) return;
    setIsAdding(true);
    setEditing({
      id: '',
      name: '',
      description: '',
      price: 0,
      duration: '',
      technicianId: session.user.id,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading services...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Services</h2>
            <p className="text-base text-gray-500">Manage your service offerings and pricing</p>
          </div>

          <div className="mb-6 flex justify-end">
            <button 
              onClick={handleAddNew}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add New Service
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Service</th>
                  <th className="text-left py-4 px-6 text-sm font-semibold text-gray-600">Description</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Duration</th>
                  <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      No services found
                    </td>
                  </tr>
                ) : (
                  services.map((service) => (
                    <tr 
                      key={service.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900">{service.description}</td>
                      <td className="py-4 px-6 text-sm text-gray-900 text-right font-medium">
                        {formatPrice(service.price)}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-900 text-right">{service.duration}</td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => {
                            setEditing(service);
                            setIsAdding(false);
                            setIsDeleting(false);
                          }}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {(editing || isAdding) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => {
              setEditing(null);
              setIsAdding(false);
              setIsDeleting(false);
            }} 
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {isAdding ? 'Add New Service' : 'Edit Service'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input 
                  name="name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editing!.name} 
                  onChange={(e) => setEditing({...editing!, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input 
                  name="description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editing!.description} 
                  onChange={(e) => setEditing({...editing!, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input 
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editing!.price} 
                  onChange={(e) => setEditing({...editing!, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input 
                  name="duration"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editing!.duration} 
                  onChange={(e) => setEditing({...editing!, duration: e.target.value})}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                {editing?.id && (
                  <button
                    type="button"
                    onClick={() => setIsDeleting(true)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setIsAdding(false);
                    setIsDeleting(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isAdding ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => setIsDeleting(false)} 
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Service</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsDeleting(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 