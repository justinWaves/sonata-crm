'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import ImageUpload from './ImageUpload';
import ComboBox from './ComboBox';

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
    photoUrl?: string;
  }) => void;
  initialValues?: Partial<{
    type: string;
    brand: string;
    model: string;
    year: string;
    serialNumber: string;
    notes: string;
    lastServiceDate: string;
    photoUrl: string;
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
    photoUrl: initialValues.photoUrl || '',
  });
  const [includeLastService, setIncludeLastService] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (photoUrl: string, publicId: string) => {
    setForm(prev => ({ ...prev, photoUrl }));
    setShowImageUpload(false);
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
      photoUrl: '',
    });
    setIncludeLastService(false);
    setShowImageUpload(false);
    onClose();
  };

  const PIANO_BRANDS = [
    '',
    'Yamaha', 'Steinway & Sons', 'Kawai', 'Baldwin', 'Boston', 'Bechstein', 'Blüthner', 'Bösendorfer', 'Chickering', 'Essex', 'Fazioli', 'Grotrian', 'Knabe', 'Mason & Hamlin', 'Petrof', 'Samick', 'Schimmel', 'Seiler', 'Young Chang', 'Wurlitzer', 'Weber', 'Story & Clark', 'Pearl River', 'Hallet, Davis & Co.', 'August Förster', 'Charles R. Walter', 'Steck', 'Hardman', 'Kimball', 'Kohler & Campbell', 'Pramberger', 'Ritmüller', 'Sohmer', 'Weinbach', 'Zimmermann', 'Heintzman', 'Hobart M. Cable', 'Lester', 'Lindeman', 'Mathushek', 'Nordiska', 'Sauter', 'Shigeru Kawai', 'Tokai', 'Vose & Sons', 'Winter & Co.', 'Other'
  ];

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
            <ComboBox
              label="Brand"
              options={PIANO_BRANDS}
              value={form.brand}
              onChange={val => handleInputChange('brand', val)}
              placeholder="Select or type a brand"
            />
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
                  onClick={() => handleInputChange('photoUrl', '')}
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
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition mb-4"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Add Piano Photo</span>
            </button>
          )}
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

      {/* Image Upload Modal */}
      {showImageUpload && (
        <Modal isOpen={showImageUpload} onClose={() => setShowImageUpload(false)} title="Upload Piano Photo" widthClass="max-w-2xl">
          <ImageUpload
            onImageUpload={handleImageUpload}
            onCancel={() => setShowImageUpload(false)}
            currentImageUrl={form.photoUrl}
          />
        </Modal>
      )}
    </Modal>
  );
}; 