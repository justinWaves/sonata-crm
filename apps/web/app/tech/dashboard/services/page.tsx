'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import PencilIcon from '@/components/PencilIcon';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';

interface ServiceType {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  technicianId: string;
  serviceType: string;
  serviceTypeColor: string;
}

const colorOptions = [
  { name: 'Purple', value: '#a78bfa', dark: '#6d28d9' },
  { name: 'Green', value: '#34d399', dark: '#059669' },
  { name: 'Yellow', value: '#fbbf24', dark: '#b45309' },
  { name: 'Red', value: '#f87171', dark: '#b91c1c' },
  { name: 'Orange', value: '#fb923c', dark: '#ea580c' },
  { name: 'Violet', value: '#c4b5fd', dark: '#7c3aed' },
  { name: 'Blue', value: '#60a5fa', dark: '#1d4ed8' },
];

function getDarkColor(hex: string) {
  const found = colorOptions.find(opt => opt.value === hex);
  if (found) {
    // Make the color even darker for text/border by blending with black
    // This is a simple approximation for a 'darker' shade
    const dark = found.dark.replace('#', '');
    const r = Math.max(0, parseInt(dark.substring(0, 2), 16) - 32).toString(16).padStart(2, '0');
    const g = Math.max(0, parseInt(dark.substring(2, 4), 16) - 32).toString(16).padStart(2, '0');
    const b = Math.max(0, parseInt(dark.substring(4, 6), 16) - 32).toString(16).padStart(2, '0');
    return `#${r}${g}${b}`;
  }
  return '#222';
}

const CloseIcon = () => (
  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export default function ServicesPage() {
  const { data: session } = useSession();
  const [services, setServices] = useState<ServiceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ServiceType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ServiceType | null>(null);
  const [isAddingNewType, setIsAddingNewType] = useState(false);
  const [showTypeManager, setShowTypeManager] = useState(false);
  const [typeEdit, setTypeEdit] = useState<{type: string, color: string} | null>(null);
  const [newType, setNewType] = useState('');
  const [newTypeColor, setNewTypeColor] = useState(colorOptions[0]?.value ?? '#a78bfa');
  const [customServiceTypes, setCustomServiceTypes] = useState<{type: string, color: string}[]>([]);
  const [editTypeModal, setEditTypeModal] = useState<{type: string, color: string} | null>(null);
  const [editTypeName, setEditTypeName] = useState('');
  const [editTypeColor, setEditTypeColor] = useState(colorOptions[0]?.value ?? '#a78bfa');
  const [deleteTypeModal, setDeleteTypeModal] = useState<{type: string, color: string} | null>(null);

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

    const selectedType = formData.get('serviceType') as string;
    const allTypes = Array.from(new Map([...uniqueServiceTypes, ...customServiceTypes].map(t => [t.type, t])).values());
    const typeInfo = allTypes.find(t => t.type === selectedType);

    // If no type is selected, both type and color should be empty strings.
    // Otherwise, find the color, with a fallback just in case.
    const serviceType = selectedType || '';
    const serviceTypeColor = selectedType ? (typeInfo?.color ?? colorOptions[0]?.value ?? '#a78bfa') : '';

    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: parseFloat(formData.get('price') as string),
      duration: formData.get('duration') as string,
      technicianId: session?.user?.id,
      serviceType: serviceType,
      serviceTypeColor: serviceTypeColor,
    };

    try {
      console.log(data)
      const response = await fetch('/api/service-types' + (editing?.id ? `/${editing.id}` : ''), {
        method: editing?.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editing?.id ? { ...data, id: editing.id } : data),
      });

      if (!response.ok) throw new Error('Failed to save service');
      
      await fetchServices();
      setCustomServiceTypes([]);
      setEditing(null);
      setIsAdding(false);
      setIsAddingNewType(false);
      toast.success(editing?.id ? 'Service updated successfully' : 'Service added successfully');
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('Failed to save service. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete?.id) return;
    try {
      const response = await fetch(`/api/service-types/${serviceToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete service');
      await fetchServices();
      setEditing(null);
      setIsDeleting(false);
      setServiceToDelete(null);
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
      serviceType: '',
      serviceTypeColor: colorOptions[0]?.value ?? '#a78bfa',
    });
  };

  const uniqueServiceTypes = useMemo(() => {
    const allTypes = services
      .map(s => ({ type: s.serviceType, color: s.serviceTypeColor }))
      .filter(t => t.type); // Filter out empty types

    const uniqueTypesMap = new Map<string, { type: string; color: string }>();
    allTypes.forEach(t => {
      if (!uniqueTypesMap.has(t.type)) {
        uniqueTypesMap.set(t.type, t);
      }
    });

    return Array.from(uniqueTypesMap.values());
  }, [services]);

  if (loading) {
    return (
      <div className="text-lg text-gray-600">Loading services...</div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Services</h2>
          <p className="text-base text-gray-500">Manage your service offerings and pricing</p>
        </div>

        <div className="mb-6 flex justify-end">
          <button 
            onClick={handleAddNew}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
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
                <th className="text-center py-4 px-6 text-sm font-semibold text-gray-600">Service Type</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Price</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Duration</th>
                <th className="text-right py-4 px-6 text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
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
                    <td className="py-4 px-6 text-center">
                      <span
                        style={service.serviceType ? {
                          background: service.serviceTypeColor,
                          color: getDarkColor(service.serviceTypeColor),
                          border: `1px solid ${getDarkColor(service.serviceTypeColor)}`,
                          fontSize: '0.92rem',
                          padding: '0.18rem 0.7rem',
                          fontWeight: 600,
                        } : {
                          background: 'transparent',
                          color: '#888',
                          border: '1px solid #ccc',
                          fontSize: '0.92rem',
                          padding: '0.18rem 0.7rem',
                          fontWeight: 600,
                        }}
                        className="inline-block text-nowrap rounded-lg"
                      >
                        {service.serviceType || 'No Type'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 text-right font-medium">
                      {formatPrice(service.price)}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 text-right">{service.duration}</td>
                    <td className="py-4 px-6 text-right text-nowrap">
                      <button
                        onClick={() => {
                          setEditing(service);
                          setIsAdding(false);
                          setIsDeleting(false);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setServiceToDelete(service);
                          setIsDeleting(true);
                        }}
                        className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {(editing || isAdding) && editing && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => {
              setEditing(null);
              setIsAdding(false);
              setIsDeleting(false);
              setIsAddingNewType(false);
            }} 
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl z-10">
            <button
              type="button"
              onClick={() => { setEditing(null); setIsAdding(false); }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <CloseIcon />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{editing?.id ? 'Edit Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <input 
                  name="name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editing.name || ''} 
                  onChange={(e) => setEditing({...editing, name: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input 
                  name="description"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editing.description || ''} 
                  onChange={(e) => setEditing({...editing, description: e.target.value})}
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
                  value={editing.price ?? 0} 
                  onChange={(e) => setEditing({...editing, price: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input 
                  name="duration"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  value={editing.duration || ''} 
                  onChange={(e) => setEditing({...editing, duration: e.target.value})}
                  required
                />
              </div>
              <div>
                <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">Service Type</label>
                <div className="mt-1 flex items-center space-x-2">
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={editing?.serviceType || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '__manage__') {
                        setShowTypeManager(true);
                      } else if (editing) {
                        setEditing({ ...editing, serviceType: value });
                      }
                    }}
                    className="flex-grow block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md cursor-pointer"
                  >
                    <option value="">Select a type</option>
                    {Array.from(new Map([...uniqueServiceTypes, ...customServiceTypes].map(t => [t.type, t])).values()).map(t => (
                      t.type && <option key={t.type} value={t.type}>{t.type}</option>
                    ))}
                    <option disabled>──────────</option>
                    <option value="__manage__">Manage service types...</option>
                  </select>
                  <button type="button" onClick={() => setShowTypeManager(true)} className="px-3 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Manage</button>
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setIsAdding(false);
                    setIsDeleting(false);
                    setIsAddingNewType(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                >
                  {isAdding ? 'Add Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Confirmation Modal */}
      {isDeleting && serviceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
            onClick={() => { setIsDeleting(false); setServiceToDelete(null); }} 
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Service</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this service? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => { setIsDeleting(false); setServiceToDelete(null); }}
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

      {/* Manage Service Types Modal */}
      {showTypeManager && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowTypeManager(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg z-10">
            <button type="button" onClick={() => setShowTypeManager(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
              <CloseIcon />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Manage Service Types</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Add New Service Type</label>
                <div className="flex items-center space-x-2 mb-2">
                  <input
                    className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Service type name..."
                    value={newType}
                    onChange={e => setNewType(e.target.value)}
                  />
                  <select
                    className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newTypeColor}
                    onChange={e => setNewTypeColor(e.target.value)}
                  >
                    {colorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.name}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                    onClick={async () => {
                      if (!newType) return;
                      setCustomServiceTypes(prev => [...prev, { type: newType, color: newTypeColor }]);
                      setNewType('');
                      setNewTypeColor(colorOptions[0]?.value ?? '#a78bfa');
                    }}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Existing Service Types</label>
                <ul>
                  {[...uniqueServiceTypes, ...customServiceTypes].map(t => {
                    const inUse = services.some(s => s.serviceType === t.type);
                    return (
                      <li key={t.type} className="flex items-center justify-between mb-2">
                        <span
                          style={{
                            background: t.color,
                            color: getDarkColor(t.color),
                            border: `1px solid ${getDarkColor(t.color)}`,
                            fontSize: '0.92rem',
                            padding: '0.18rem 0.7rem',
                            fontWeight: 600,
                          }}
                          className="inline-block rounded-lg mr-2"
                        >
                          {t.type}
                        </span>
                        <div className="flex items-center space-x-2">
                          <button
                            type="button"
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium cursor-pointer"
                            onClick={() => {
                              setEditTypeModal(t);
                              setEditTypeName(t.type);
                              setEditTypeColor(t.color);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="text-red-600 hover:text-red-800 text-xs font-medium cursor-pointer"
                            onClick={() => setDeleteTypeModal(t)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowTypeManager(false)}
                className="mt-6 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Type Modal */}
      {editTypeModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditTypeModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
            <button type="button" onClick={() => setEditTypeModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
              <CloseIcon />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Edit Service Type</h3>
            <div className="mb-4 flex items-center space-x-2">
              <input
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={editTypeName}
                onChange={e => setEditTypeName(e.target.value)}
              />
              <select
                className="border border-gray-300 rounded-lg px-2 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                value={editTypeColor}
                onChange={e => setEditTypeColor(e.target.value)}
              >
                {colorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.name}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                onClick={() => setEditTypeModal(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 cursor-pointer"
                onClick={async () => {
                  if (!session?.user?.id || !editTypeModal) return;
                  try {
                    const response = await fetch('/api/service-type-categories', {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        technicianId: session.user.id,
                        oldType: editTypeModal.type,
                        newType: editTypeName,
                        newColor: editTypeColor,
                      }),
                    });
                    if (!response.ok) throw new Error('Failed to update category');
                    await fetchServices();
                    setEditTypeModal(null);
                    toast.success('Category updated successfully');
                  } catch (error) {
                    toast.error('Failed to update category');
                  }
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Type Modal */}
      {deleteTypeModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteTypeModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-md z-10">
            <button type="button" onClick={() => setDeleteTypeModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer">
              <CloseIcon />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Service Type</h3>
            <p className="text-gray-600 mb-6">
              {services.filter(s => s.serviceType === deleteTypeModal.type).length > 0
                ? `There are ${services.filter(s => s.serviceType === deleteTypeModal.type).length} services using this type. Deleting will leave those services with no type.`
                : 'Are you sure you want to delete this service type?'}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeleteTypeModal(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!session?.user?.id || !deleteTypeModal) return;
                  try {
                    const response = await fetch('/api/service-type-categories', {
                      method: 'DELETE',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        technicianId: session.user.id,
                        type: deleteTypeModal.type,
                      }),
                    });
                    if (!response.ok) throw new Error('Failed to delete category');
                    await fetchServices();
                    setDeleteTypeModal(null);
                    toast.success('Category deleted successfully');
                  } catch (error) {
                    toast.error('Failed to delete category');
                  }
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 