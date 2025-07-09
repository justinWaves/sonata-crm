import React, { useState } from 'react';
import Modal from './Modal';
import type { Customer } from '../types/customer';
import { HiMail, HiPhone, HiLocationMarker, HiChatAlt2, HiChevronLeft, HiChevronRight } from 'react-icons/hi';

interface CustomerCardModalProps {
  customer: Customer;
  onClose: () => void;
  onEdit?: (customer: Customer) => void;
}

const CustomerCardModal: React.FC<CustomerCardModalProps> = ({ customer, onClose, onEdit }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PIANOS_PER_PAGE = 5;
  if (!customer || !customer.firstName || !customer.lastName) return null;
  const pianos = customer.pianos || [];
  const totalPages = Math.ceil(pianos.length / PIANOS_PER_PAGE);
  const startIndex = (currentPage - 1) * PIANOS_PER_PAGE;
  const endIndex = startIndex + PIANOS_PER_PAGE;
  const currentPianos = pianos.slice(startIndex, endIndex);
  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <Modal isOpen={true} onClose={onClose} title="Customer Details" widthClass="max-w-lg md:max-w-xl">
      <div className="space-y-3 px-2 pb-2 flex flex-col h-full">
        {/* Compact Header */}
        <div className="flex items-center gap-4 p-3">
          <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-lg text-blue-700 font-bold shadow">
            {(customer.firstName?.[0] || '') + (customer.lastName?.[0] || '')}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-lg font-semibold text-gray-900 truncate">{customer.firstName} {customer.lastName}</div>
            {customer.companyName && <div className="text-sm text-blue-700 font-medium truncate">{customer.companyName}</div>}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm bg-white rounded-lg p-3 shadow divide-y-0">
          <div className="flex items-center gap-2">
            <HiMail className="text-blue-500 w-5 h-5" />
            <span className="text-gray-500">Email:</span>
            <span className="font-medium text-gray-900 ml-1 truncate">{customer.email || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <HiPhone className="text-blue-500 w-5 h-5" />
            <span className="text-gray-500">Phone:</span>
            <span className="font-medium text-gray-900 ml-1">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
            <HiLocationMarker className="text-blue-500 w-5 h-5" />
            <span className="text-gray-500">Address:</span>
            <span className="font-medium text-gray-900 ml-1 truncate">{customer.address}{customer.city ? `, ${customer.city}` : ''}{customer.state ? `, ${customer.state}` : ''}{customer.zipCode ? `, ${customer.zipCode}` : ''}</span>
          </div>
          <div className="flex items-center gap-3 col-span-1 sm:col-span-2 mt-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">Text Updates: {customer.textUpdates ? 'Yes' : 'No'}</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-medium">Email Updates: {customer.emailUpdates ? 'Yes' : 'No'}</span>
          </div>
        </div>

        {/* Pianos Section */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex items-center justify-between mb-2 mt-1">
            <div className="font-bold text-base text-gray-900">Pianos</div>
            {pianos.length > PIANOS_PER_PAGE && (
              <div className="text-xs text-gray-500">
                {startIndex + 1}-{Math.min(endIndex, pianos.length)} of {pianos.length}
              </div>
            )}
          </div>
          <div className="flex-1 min-h-0 flex flex-col">
            {pianos.length > 0 ? (
              <>
                <div className="space-y-2 overflow-y-auto pr-1 flex-1 min-h-0">
                  {currentPianos.map((piano) => (
                    <div key={piano.id} className="flex items-center gap-3 p-2 bg-white rounded-lg shadow hover:shadow-md transition group">
                      {piano.photoUrl ? (
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <img src={piano.photoUrl} alt="Piano" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-14 h-14 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 flex-shrink-0">
                          <span className="text-2xl">🎹</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-900 truncate text-sm">{piano.brand || 'Unknown Brand'} {piano.model || ''}</div>
                        <div className="text-xs text-gray-500 mb-0.5">{piano.type || ''}{piano.year ? ` • ${piano.year}` : ''}</div>
                        {piano.serialNumber && <div className="text-xs text-gray-400">SN: {piano.serialNumber}</div>}
                        {piano.notes && <div className="text-xs text-blue-500 mt-0.5 truncate">{piano.notes}</div>}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200 flex-shrink-0">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HiChevronLeft className="w-4 h-4" />
                      Previous
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-7 h-7 rounded text-xs font-medium ${
                            page === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                      <HiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500 text-xs">No pianos listed.</div>
            )}
          </div>
        </div>
        {/* Edit Button at the Bottom */}
        {onEdit && (
          <div className="flex justify-end pt-2 border-t border-gray-100 bg-white sticky bottom-0 z-10">
            <button
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition md:static md:shadow-none md:rounded md:px-4 md:py-2"
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