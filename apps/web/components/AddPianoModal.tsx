'use client';

import React, { useState } from 'react';
import Modal from './Modal';

interface AddPianoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (piano: {
    type: string;
    brand?: string;
    model?: string;
    year?: string;
    serialNumber?: string;
    notes?: string;
    lastServiceDate?: string | undefined;
  }) => void;
  initialValues?: Partial<{
    type: string;
    brand: string;
    model: string;
    year: string;
    serialNumber: string;
    notes: string;
    lastServiceDate: string;
  }>;
}

export const AddPianoModal: React.FC<AddPianoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialValues = {},
}) => {
  const [form, setForm] = useState({
    type: initialValues.type || '',
    brand: initialValues.brand || '',
    model: initialValues.model || '',
    year: initialValues.year || '',
    serialNumber: initialValues.serialNumber || '',
    notes: initialValues.notes || '',
    lastServiceDate: initialValues.lastServiceDate || '',
  });
  const [includeLastService, setIncludeLastService] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.type) return; // Require type
    
    const pianoData = {
      ...form,
      lastServiceDate: includeLastService ? form.lastServiceDate : undefined,
    };
    
    onSave(pianoData);
  };

  const handleClose = () => {
    setForm({
      type: '',
      brand: '',
      model: '',
      year: '',
      serialNumber: '',
      notes: '',
      lastServiceDate: '',
    });
    setIncludeLastService(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Piano" widthClass="max-w-lg">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Type <span className="text-red-500">*</span></label>
          <select
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={form.type}
            onChange={e => handleInputChange('type', e.target.value)}
          >
            <option value="">Select type</option>
            <option value="Grand">Grand</option>
            <option value="Upright">Upright</option>
            <option value="Console">Console</option>
            <option value="Spinet">Spinet</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Brand</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.brand} onChange={e => handleInputChange('brand', e.target.value)} />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Model</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.model} onChange={e => handleInputChange('model', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Year</label>
            <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.year} onChange={e => handleInputChange('year', e.target.value)} />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Serial Number</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.serialNumber} onChange={e => handleInputChange('serialNumber', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.notes} onChange={e => handleInputChange('notes', e.target.value)} />
        </div>
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="includeLastService"
              checked={includeLastService}
              onChange={(e) => setIncludeLastService(e.target.checked)}
              className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="includeLastService" className="text-sm font-medium text-gray-700">
              Include Last Service Date
            </label>
          </div>
          {includeLastService && (
            <input
              type="date"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.lastServiceDate}
              onChange={e => handleInputChange('lastServiceDate', e.target.value)}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!form.type}
        >
          Save
        </button>
      </div>
    </Modal>
  );
}; 