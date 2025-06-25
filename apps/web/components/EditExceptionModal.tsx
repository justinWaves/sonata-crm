'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { checkExceptionConflict, validateTimeRange } from '@/lib/utils';

interface ScheduleException {
  id: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
  reason: string | null;
}

interface EditExceptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { 
    date: string, 
    endDate: string, 
    startTime: string, 
    endTime: string, 
    isAvailable: boolean, 
    reason: string | null
  }) => void;
  exceptionGroup: ScheduleException[];
  allExceptions: ScheduleException[]; // For conflict detection
}

export function EditExceptionModal({ 
  isOpen, 
  onClose, 
  onSave, 
  exceptionGroup, 
  allExceptions 
}: EditExceptionModalProps) {
  const [formData, setFormData] = useState({
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isAvailable: true,
    reason: null as string | null,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const first = exceptionGroup?.[0];
    const last = exceptionGroup?.[exceptionGroup.length - 1];

    if (isOpen && first && last) {
      setFormData({
        date: new Date(first.date).toISOString().split('T')[0]!,
        endDate: new Date(last.date).toISOString().split('T')[0]!,
        startTime: first.startTime || '',
        endTime: first.endTime || '',
        isAvailable: first.isAvailable,
        reason: first.reason,
      });
      setErrors([]);
    }
  }, [exceptionGroup, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Required fields
    if (!formData.date) {
      newErrors.push('Start date is required');
    }

    if (!formData.endDate) {
      newErrors.push('End date is required');
    }

    // Date validation
    if (formData.date && formData.endDate) {
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.push('End date cannot be before start date');
      }
    }

    // Time validation for available exceptions
    if (formData.isAvailable && formData.startTime && formData.endTime) {
      if (!validateTimeRange(formData.startTime, formData.endTime)) {
        newErrors.push('End time must be after start time');
      }
    }

    // Conflict detection
    if (formData.date && formData.endDate) {
      const startDate = new Date(formData.date);
      const endDate = new Date(formData.endDate);
      
      // Filter out the current exception group from conflict detection
      const currentIds = new Set(exceptionGroup.map(e => e.id));
      const otherExceptions = allExceptions.filter(e => !currentIds.has(e.id));
      
      const conflict = checkExceptionConflict(
        {
          startDate,
          endDate,
          startTime: formData.isAvailable ? formData.startTime : null,
          endTime: formData.isAvailable ? formData.endTime : null,
          isAvailable: formData.isAvailable,
        },
        otherExceptions.map(e => ({
          date: new Date(e.date),
          startTime: e.startTime,
          endTime: e.endTime,
          isAvailable: e.isAvailable,
        }))
      );

      if (conflict) {
        newErrors.push(conflict.message);
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  if (!isOpen || !isClient) {
    return null;
  }

  return createPortal(
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Exception</h2>
        
        {/* Error Display */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
                <div className="mt-2 text-sm text-red-700">
                  <ul className="list-disc pl-5 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5 cursor-pointer"
            />
            <span className="ml-3 text-sm text-gray-700">Available during this time</span>
          </div>

          {formData.isAvailable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
            <input
              type="text"
              placeholder="e.g., Vacation, Holiday"
              value={formData.reason || ''}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={errors.length > 0}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
} 