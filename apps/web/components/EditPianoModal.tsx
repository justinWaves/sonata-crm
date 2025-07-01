import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import type { Piano } from '../types/piano';

interface EditPianoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (piano: Piano) => void;
  initialValues: Piano;
}

export const EditPianoModal: React.FC<EditPianoModalProps> = ({ isOpen, onClose, onSave, initialValues }) => {
  const [form, setForm] = useState<Piano>({ ...initialValues });
  const [isDirty, setIsDirty] = useState(false);
  const initialForm = useRef<Piano>(initialValues);

  useEffect(() => {
    setForm({ ...initialValues });
    initialForm.current = initialValues;
    setIsDirty(false);
  }, [isOpen, initialValues]);

  useEffect(() => {
    setIsDirty(
      Object.keys(form).some(key => form[key as keyof Piano] !== initialForm.current[key as keyof Piano])
    );
  }, [form]);

  const handleInputChange = <K extends keyof Piano>(field: K, value: Piano[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
  };

  const handleClose = () => {
    setForm({ ...initialValues });
    setIsDirty(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Piano" widthClass="max-w-lg">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400">
            <span className="text-3xl">🎹</span>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1 text-gray-700">Type</label>
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={form.type || ''}
              onChange={e => handleInputChange('type', e.target.value as Piano['type'])}
            >
              <option value="">Select type</option>
              <option value="Grand">Grand</option>
              <option value="Upright">Upright</option>
              <option value="Console">Console</option>
              <option value="Spinet">Spinet</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Brand</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.brand || ''} onChange={e => handleInputChange('brand', e.target.value as Piano['brand'])} />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Model</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.model || ''} onChange={e => handleInputChange('model', e.target.value as Piano['model'])} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Year</label>
            <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.year || ''} onChange={e => handleInputChange('year', e.target.value as Piano['year'])} />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Serial Number</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.serialNumber || ''} onChange={e => handleInputChange('serialNumber', e.target.value as Piano['serialNumber'])} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
          <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.notes || ''} onChange={e => handleInputChange('notes', e.target.value as Piano['notes'])} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Last Service Date</label>
          <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.lastServiceDate || ''} onChange={e => handleInputChange('lastServiceDate', e.target.value as Piano['lastServiceDate'])} />
        </div>
      </div>
      <div className="flex justify-end space-x-2 pt-2">
        <button type="button" onClick={handleClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isDirty}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default EditPianoModal; 