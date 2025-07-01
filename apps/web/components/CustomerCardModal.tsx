import React from 'react';
import Modal from './Modal';
import type { Customer } from '../types/customer';

interface CustomerCardModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit?: (customer: Customer) => void;
}

const CustomerCardModal: React.FC<CustomerCardModalProps> = ({ customer, onClose, onEdit }) => {
  if (!customer || !customer.firstName || !customer.lastName) return null;
  return (
    <Modal isOpen={true} onClose={onClose} title="Customer Details" widthClass="max-w-lg">
      <div className="space-y-4 px-2 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl text-blue-600 font-bold">
            {(customer.firstName?.[0] || '') + (customer.lastName?.[0] || '')}
          </div>
          <div>
            <div className="text-lg font-semibold">{customer.firstName} {customer.lastName}</div>
            {customer.companyName && <div className="text-gray-500 text-sm">{customer.companyName}</div>}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div><span className="font-medium">Email:</span> {customer.email || '-'}</div>
          <div><span className="font-medium">Phone:</span> {customer.phone}</div>
          <div><span className="font-medium">Address:</span> {customer.address}{customer.city ? `, ${customer.city}` : ''}{customer.state ? `, ${customer.state}` : ''}{customer.zipCode ? `, ${customer.zipCode}` : ''}</div>
          <div><span className="font-medium">Text Updates:</span> {customer.textUpdates ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Email Updates:</span> {customer.emailUpdates ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <div className="font-semibold mb-2">Pianos</div>
          {customer.pianos && customer.pianos.length > 0 ? (
            <div className="space-y-2">
              {customer.pianos.map((piano) => (
                <div key={piano.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  {piano.photoUrl ? (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                      <img src={piano.photoUrl} alt="Piano" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                      <span className="text-3xl">🎹</span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium">{piano.brand || 'Unknown Brand'} {piano.model || ''}</div>
                    <div className="text-xs text-gray-500">{piano.type || ''} {piano.year ? `• ${piano.year}` : ''}</div>
                    {piano.serialNumber && <div className="text-xs text-gray-400">SN: {piano.serialNumber}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No pianos listed.</div>
          )}
        </div>
        {onEdit && (
          <div className="flex justify-end mt-6">
            <button
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-base font-semibold shadow-lg hover:bg-blue-700 transition fixed bottom-8 right-8 md:static md:shadow-none md:rounded md:px-4 md:py-2"
              onClick={() => onEdit(customer)}
            >
              Edit Customer
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CustomerCardModal; 