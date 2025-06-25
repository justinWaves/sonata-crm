'use client';

import React, { useState, useEffect } from 'react';
import Modal from './Modal';

// This interface should ideally be in a shared types file
export interface WeeklySchedule {
  id: string;
  technicianId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  blockName: string;
  isAvailable: boolean;
}

interface EditTimeBlockModalProps {
  isOpen: boolean;
  schedule: WeeklySchedule | null;
  onClose: () => void;
  onSave: (schedule: WeeklySchedule) => void;
  onDelete: (scheduleId: string) => void;
}

export const EditTimeBlockModal: React.FC<EditTimeBlockModalProps> = ({
  isOpen,
  schedule,
  onClose,
  onSave,
  onDelete,
}) => {
  const [editedSchedule, setEditedSchedule] = useState<WeeklySchedule | null>(null);

  useEffect(() => {
    setEditedSchedule(schedule);
  }, [schedule]);

  if (!isOpen || !editedSchedule) return null;

  const handleSave = () => {
    if (editedSchedule) {
      onSave(editedSchedule);
    }
  };

  const handleDelete = () => {
    if (editedSchedule) {
      onDelete(editedSchedule.id);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedSchedule((prev: WeeklySchedule | null) => {
      if (!prev) return null;
      const isNumeric = ['duration', 'dayOfWeek'].includes(name);
      return {
        ...prev,
        [name]: isNumeric ? parseInt(value, 10) : value,
      };
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Time Slot">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Block Name</label>
          <input
            type="text"
            name="blockName"
            value={editedSchedule.blockName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={editedSchedule.startTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            name="endTime"
            value={editedSchedule.endTime}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1"
          />
        </div>
      </div>
      <div className="flex justify-between items-center mt-8">
        <button onClick={handleDelete} className="text-red-600 hover:text-red-800 font-medium px-4 py-2 rounded-lg cursor-pointer">
          Delete Time Slot
        </button>
        <div className="flex space-x-4">
          <button onClick={onClose} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer">
            Save
          </button>
        </div>
      </div>
    </Modal>
  );
}; 