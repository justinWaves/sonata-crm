import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import type { Piano } from '../types/piano';
import ImageUpload from './ImageUpload';
import ComboBox from './ComboBox';

interface EditPianoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (piano: Piano) => void;
  onDelete?: (piano: Piano) => void;
  initialValues: Piano;
}

export const EditPianoModal: React.FC<EditPianoModalProps> = ({ isOpen, onClose, onSave, onDelete, initialValues }) => {
  const [form, setForm] = useState<Piano>({ ...initialValues });
  const [isDirty, setIsDirty] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
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

  const handleImageUpload = (photoUrl: string, publicId: string) => {
    setForm((prev) => ({ ...prev, photoUrl }));
    setShowImageUpload(false);
  };

  const handleRemovePhoto = async () => {
    if (!form.id || !form.photoUrl) {
      setForm((prev) => ({ ...prev, photoUrl: '' }));
      return;
    }
    try {
      await fetch(`/api/upload/piano/${form.id}/photo`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      setForm((prev) => ({ ...prev, photoUrl: '' }));
    } catch (err) {
      setForm((prev) => ({ ...prev, photoUrl: '' }));
    }
  };

  const handleSave = () => {
    onSave(form);
  };

  const handleClose = () => {
    setForm({ ...initialValues });
    setIsDirty(false);
    setShowImageUpload(false);
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    if (onDelete) onDelete(form);
  };

  const PIANO_BRANDS = [
    '',
    'Yamaha', 'Steinway & Sons', 'Kawai', 'Baldwin', 'Boston', 'Bechstein', 'Blüthner', 'Bösendorfer', 'Chickering', 'Essex', 'Fazioli', 'Grotrian', 'Knabe', 'Mason & Hamlin', 'Petrof', 'Samick', 'Schimmel', 'Seiler', 'Young Chang', 'Wurlitzer', 'Weber', 'Story & Clark', 'Pearl River', 'Hallet, Davis & Co.', 'August Förster', 'Charles R. Walter', 'Steck', 'Hardman', 'Kimball', 'Kohler & Campbell', 'Pramberger', 'Ritmüller', 'Sohmer', 'Weinbach', 'Zimmermann', 'Heintzman', 'Hobart M. Cable', 'Lester', 'Lindeman', 'Mathushek', 'Nordiska', 'Sauter', 'Shigeru Kawai', 'Tokai', 'Vose & Sons', 'Winter & Co.', 'Other'
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Piano" widthClass="max-w-lg">
      <div className="space-y-4">
        {/* Photo Upload Section */}
        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium mb-2 text-gray-700 self-start">Piano Photo</label>
          {form.photoUrl ? (
            <>
              <div className="w-32 h-32 rounded-lg overflow-hidden border border-gray-200 mb-2">
                <img 
                  src={form.photoUrl} 
                  alt="Piano" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setShowImageUpload(true)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowImageUpload(true)}
              className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-center hover:border-gray-400 transition-colors mb-4"
            >
              <div className="space-y-2">
                <svg className="mx-auto w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-gray-600">Add/Change Piano Photo</p>
              </div>
            </button>
          )}
        </div>
        {/* Form Fields */}
        <div className="flex gap-2">
          <div className="w-1/2">
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
          <div className="w-1/2">
            <ComboBox
              label="Brand"
              options={PIANO_BRANDS}
              value={form.brand || ''}
              onChange={val => handleInputChange('brand', val as Piano['brand'])}
              placeholder="Select or type a brand"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Model</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.model || ''} onChange={e => handleInputChange('model', e.target.value as Piano['model'])} />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Year</label>
            <input type="number" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.year || ''} onChange={e => handleInputChange('year', e.target.value as Piano['year'])} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Serial Number</label>
            <input type="text" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.serialNumber || ''} onChange={e => handleInputChange('serialNumber', e.target.value as Piano['serialNumber'])} />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Notes</label>
            <textarea className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.notes || ''} onChange={e => handleInputChange('notes', e.target.value as Piano['notes'])} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Last Service Date</label>
          <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" value={form.lastServiceDate || ''} onChange={e => handleInputChange('lastServiceDate', e.target.value as Piano['lastServiceDate'])} />
        </div>
      </div>
      {showImageUpload && (
        <Modal isOpen={showImageUpload} onClose={() => setShowImageUpload(false)} title="Upload Piano Photo" widthClass="max-w-2xl">
          <ImageUpload
            onImageUpload={handleImageUpload}
            onCancel={() => setShowImageUpload(false)}
            currentImageUrl={form.photoUrl || undefined}
          />
        </Modal>
      )}
      {/* Delete Piano Button */}
      <div className="flex justify-between items-center pt-2">
        {onDelete && (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 rounded-lg text-red-600 font-medium text-base hover:bg-red-50 focus:outline-none"
          >
            Delete Piano
          </button>
        )}
        <div className="flex space-x-2 ml-auto">
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
      </div>
      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <Modal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Piano?" widthClass="max-w-md">
          <div className="p-4 text-center">
            <p className="mb-6 text-gray-700">Are you sure you want to delete this piano? This action cannot be undone.</p>
            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default EditPianoModal; 