import React, { useState } from 'react';
import { useCustomerTable } from './CustomerTableContext';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { FiMail, FiTrash2 } from 'react-icons/fi';

export default function BulkBar({ customers, fetchCustomers, setCustomers }: { customers: any[]; fetchCustomers: () => Promise<any>; setCustomers: (customers: any[]) => void }) {
  const { selectedIds, setSelectedIds } = useCustomerTable();
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  if (selectedIds.size === 0) return null;
  const selected = customers.filter(c => selectedIds.has(c.id));
  const emails = selected.map(c => c.email).filter(Boolean).join(',');

  const handleDelete = async () => {
    setShowBulkDeleteConfirm(false);
    const res = await fetch('/api/customers/bulk-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: Array.from(selectedIds) }),
    });
    if (res.ok) {
      toast.success('Customers deleted');
      setSelectedIds(new Set());
      const updatedCustomers = await fetchCustomers();
      setCustomers(updatedCustomers);
    } else {
      toast.error('Failed to delete customers');
    }
  };

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95vw] max-w-2xl bg-white border border-gray-200 shadow-xl z-50 flex items-center justify-between px-6 py-3 rounded-2xl gap-4 transition-all">
        <div className="text-sm text-gray-700 font-medium">
          {selected.length} selected
        </div>
        <div className="flex gap-2 sm:gap-3">
          <a
            href={`mailto:?bcc=${encodeURIComponent(emails)}`}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
            aria-label="Email selected customers"
          >
            <FiMail className="w-5 h-5" />
            <span>Email</span>
          </a>
          <button
            onClick={() => setShowBulkDeleteConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition"
            aria-label="Delete selected customers"
          >
            <FiTrash2 className="w-5 h-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>
      {showBulkDeleteConfirm && (
        <Modal isOpen={showBulkDeleteConfirm} onClose={() => setShowBulkDeleteConfirm(false)} title="Delete Selected Customers?">
          <p className="text-gray-700 mb-6">This will permanently delete the selected customers and all related data. Are you sure?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowBulkDeleteConfirm(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium shadow-sm hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </Modal>
      )}
    </>
  );
} 