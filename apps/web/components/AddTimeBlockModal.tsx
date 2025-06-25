'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { WeeklySchedule } from './EditTimeBlockModal';

interface AddTimeBlockModalProps {
  isOpen: boolean;
  dayOfWeek: number;
  onClose: () => void;
  onSave: (schedule: Omit<WeeklySchedule, 'id' | 'technicianId'>) => void;
}

export const AddTimeBlockModal: React.FC<AddTimeBlockModalProps> = ({
  isOpen,
  dayOfWeek,
  onClose,
  onSave,
}) => {
  const [newSchedule, setNewSchedule] = useState({
    blockName: 'New Slot',
    startTime: '09:00',
    endTime: '10:00',
    dayOfWeek,
    isAvailable: true,
  });

  useEffect(() => {
    setNewSchedule({
      blockName: 'New Slot',
      startTime: '09:00',
      endTime: '10:00',
      dayOfWeek,
      isAvailable: true,
    });
  }, [isOpen, dayOfWeek]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(newSchedule);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSchedule(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Time Slot">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Block Name</label>
          <input
            type="text"
            name="blockName"
            value={newSchedule.blockName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={newSchedule.startTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            name="endTime"
            value={newSchedule.endTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
          />
        </div>
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
          Cancel
        </button>
        <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
          Add Slot
        </button>
      </div>
    </Modal>
  );
}; 