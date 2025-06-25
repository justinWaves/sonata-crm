'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { SunIcon } from '@/components/SunIcon';
import { MoonIcon } from '@/components/MoonIcon';
import { EditTimeBlockModal, WeeklySchedule } from '@/components/EditTimeBlockModal';
import { AddTimeBlockModal } from '@/components/AddTimeBlockModal';
import { EditExceptionModal } from '@/components/EditExceptionModal';
import { checkExceptionConflict, validateTimeRange } from '@/lib/utils';

/*
interface WeeklySchedule {
  id: string;
  technicianId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  duration: number; // in minutes
  blockName: string;
  isAvailable: boolean;
}
*/

interface ScheduleException {
  id: string;
  technicianId: string;
  date: string;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
  reason: string | null;
}

interface Technician {
  id: string;
  defaultSlotDurationMinutes: number;
  defaultBufferMinutes: number;
}

const DAYS = [
  { day: 'SUN', dayOfWeek: 0, name: 'Sunday' },
  { day: 'MON', dayOfWeek: 1, name: 'Monday' },
  { day: 'TUE', dayOfWeek: 2, name: 'Tuesday' },
  { day: 'WED', dayOfWeek: 3, name: 'Wednesday' },
  { day: 'THU', dayOfWeek: 4, name: 'Thursday' },
  { day: 'FRI', dayOfWeek: 5, name: 'Friday' },
  { day: 'SAT', dayOfWeek: 6, name: 'Saturday' },
];

const TIME_SLOT_COLORS = [
  'bg-blue-100 border-blue-300 text-blue-800',
  'bg-green-100 border-green-300 text-green-800',
  'bg-purple-100 border-purple-300 text-purple-800',
  'bg-orange-100 border-orange-300 text-orange-800',
  'bg-pink-100 border-pink-300 text-pink-800',
];

export default function AvailabilityPage() {
  const { data: session } = useSession();
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule[]>([]);
  const [scheduleExceptions, setScheduleExceptions] = useState<ScheduleException[]>([]);
  const [technician, setTechnician] = useState<Technician | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingSchedule, setEditingSchedule] = useState<WeeklySchedule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [dayToAddTo, setDayToAddTo] = useState<number | null>(null);
  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [editingExceptionGroup, setEditingExceptionGroup] = useState<ScheduleException[] | null>(null);
  const [isEditExceptionModalOpen, setIsEditExceptionModalOpen] = useState(false);
  const [newException, setNewException] = useState({
    date: '',
    endDate: '',
    startTime: '',
    endTime: '',
    isAvailable: true,
    reason: '',
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchData();
    }
  }, [session]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const fetchData = async () => {
    try {
      // Fetch weekly schedule
      const scheduleResponse = await fetch('/api/availability');
      const scheduleData = await scheduleResponse.json();
      if (!scheduleResponse.ok) throw new Error(scheduleData.error || 'Failed to fetch schedule');
      setWeeklySchedule(scheduleData);

      // Fetch technician settings
      const techResponse = await fetch('/api/technician');
      const techData = await techResponse.json();
      if (!techResponse.ok) throw new Error(techData.error || 'Failed to fetch technician data');
      setTechnician(techData);

      // Fetch schedule exceptions
      const exceptionsResponse = await fetch('/api/schedule-exceptions');
      const exceptionsData = await exceptionsResponse.json();
      if (!exceptionsResponse.ok) throw new Error(exceptionsData.error || 'Failed to fetch exceptions');
      setScheduleExceptions(exceptionsData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handlePaddingUpdate = async (defaultSlotDuration: number, defaultBufferMinutes: number) => {
    try {
      const response = await fetch('/api/technician', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultSlotDurationMinutes: defaultSlotDuration,
          defaultBufferMinutes: defaultBufferMinutes,
        }),
      });

      if (!response.ok) throw new Error('Failed to update padding settings');
      
      await fetchData();
      toast.success('Padding settings updated successfully');
    } catch (error) {
      console.error('Error updating padding settings:', error);
      toast.error('Failed to update padding settings. Please try again.');
    }
  };

  const handleAddException = async () => {
    try {
      const startDate = new Date(newException.date);
      const endDate = newException.endDate ? new Date(newException.endDate) : startDate;
      
      // Validate dates
      if (endDate < startDate) {
        toast.error('End date cannot be before start date');
        return;
      }
      
      // Validate time range for available exceptions
      if (newException.isAvailable && newException.startTime && newException.endTime) {
        if (!validateTimeRange(newException.startTime, newException.endTime)) {
          toast.error('End time must be after start time');
          return;
        }
      }
      
      // Check for conflicts with existing exceptions
      const conflict = checkExceptionConflict(
        {
          startDate,
          endDate,
          startTime: newException.isAvailable ? newException.startTime : null,
          endTime: newException.isAvailable ? newException.endTime : null,
          isAvailable: newException.isAvailable,
        },
        scheduleExceptions.map(e => ({
          date: new Date(e.date),
          startTime: e.startTime,
          endTime: e.endTime,
          isAvailable: e.isAvailable,
        }))
      );

      if (conflict) {
        toast.error(`Cannot add exception: ${conflict.message}`);
        return;
      }
      
      // If end date is provided, create exceptions for all dates in range
      if (endDate && endDate >= startDate) {
        const exceptions = [];
        const currentDate = new Date(startDate);
        
        while (currentDate <= endDate) {
          const exceptionData = {
            technicianId: session?.user?.id,
            date: currentDate.toISOString().split('T')[0], // YYYY-MM-DD format
            startTime: newException.isAvailable ? newException.startTime : null,
            endTime: newException.isAvailable ? newException.endTime : null,
            isAvailable: newException.isAvailable,
            reason: newException.reason || null,
          };
          
          const response = await fetch('/api/schedule-exceptions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(exceptionData),
          });

          if (!response.ok) throw new Error('Failed to add exception');
          
          const createdException = await response.json();
          exceptions.push(createdException);
          
          // Move to next day
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        await fetchData();
        setNewException({ date: '', endDate: '', startTime: '', endTime: '', isAvailable: true, reason: '' });
        setShowExceptionForm(false);
        toast.success(`Added ${exceptions.length} exception days successfully`);
      }
    } catch (error) {
      console.error('Error adding exception:', error);
      toast.error('Failed to add exception. Please try again.');
    }
  };

  const handleDeleteException = async (exceptionId: string) => {
    try {
      const response = await fetch(`/api/schedule-exceptions?id=${exceptionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete exception');
      
      await fetchData();
      toast.success('Exception deleted successfully');
    } catch (error) {
      console.error('Error deleting exception:', error);
      toast.error('Failed to delete exception. Please try again.');
    }
  };

  const updateScheduleOnBackend = async (updatedSchedule: WeeklySchedule[]) => {
    try {
        const response = await fetch('/api/availability', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedSchedule),
        });

        if (!response.ok) {
            throw new Error('Failed to save changes.');
        }

        toast.success('Availability updated!');
        // Re-fetch data to ensure UI is in sync with DB, especially for new item IDs
        await fetchData(); 
    } catch (error) {
        console.error('Error saving changes:', error);
        toast.error(error instanceof Error ? error.message : 'An unknown error occurred.');
        // Optional: Revert local state to previous state on error
    }
  };

  const handleAvailabilityToggle = (dayOfWeek: number, isChecked: boolean) => {
    let updatedSchedules = [...weeklySchedule];

    if (isChecked) {
      if (updatedSchedules.filter(s => s.dayOfWeek === dayOfWeek).length === 0) {
        // If no schedules exist, add a default one.
        const newBlock = {
          id: `temp-${Date.now()}`, // Temp ID for React key
          technicianId: session?.user?.id || '',
          dayOfWeek,
          isAvailable: true,
          blockName: 'Morning',
          startTime: '09:00',
          endTime: '12:00',
        };
        updatedSchedules = [...updatedSchedules, newBlock];
      } else {
        // Otherwise, mark all existing schedules as available
        updatedSchedules = weeklySchedule.map(schedule => 
          schedule.dayOfWeek === dayOfWeek ? { ...schedule, isAvailable: true } : schedule
        );
      }
    } else {
      // If unchecking, mark all schedules for the day as unavailable
      updatedSchedules = weeklySchedule.map(schedule => 
        schedule.dayOfWeek === dayOfWeek ? { ...schedule, isAvailable: false } : schedule
      );
    }

    setWeeklySchedule(updatedSchedules);
    updateScheduleOnBackend(updatedSchedules);
  };

  const hasTimeConflict = (schedules: WeeklySchedule[], checkSchedule: WeeklySchedule): boolean => {
    const checkStart = new Date(`1970-01-01T${checkSchedule.startTime}`);
    const checkEnd = new Date(`1970-01-01T${checkSchedule.endTime}`);

    for (const schedule of schedules) {
      if (schedule.id === checkSchedule.id) continue; // Don't compare with itself

      const start = new Date(`1970-01-01T${schedule.startTime}`);
      const end = new Date(`1970-01-01T${schedule.endTime}`);

      if (checkStart < end && checkEnd > start) {
        return true; // Found an overlap
      }
    }
    return false;
  };

  const handleOpenEditModal = (schedule: WeeklySchedule) => {
    setEditingSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingSchedule(null);
  };

  const handleOpenAddModal = (dayOfWeek: number) => {
    setDayToAddTo(dayOfWeek);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setDayToAddTo(null);
  };

  const handleSaveSchedule = (updatedSchedule: WeeklySchedule) => {
    const otherSchedules = weeklySchedule.filter(s => s.dayOfWeek === updatedSchedule.dayOfWeek);
    if (hasTimeConflict(otherSchedules, updatedSchedule)) {
      toast.error('Time conflict detected with another time block.');
      return;
    }

    const newSchedules = weeklySchedule.map(s => s.id === updatedSchedule.id ? updatedSchedule : s);
    setWeeklySchedule(newSchedules);
    handleCloseEditModal();
    updateScheduleOnBackend(newSchedules);
  };

  const handleAddSchedule = (newScheduleData: Omit<WeeklySchedule, 'id' | 'technicianId'>) => {
    const tempId = `new-${Date.now()}`;
    const technicianId = session?.user?.id || '';
    
    const newSchedule: WeeklySchedule = {
      ...newScheduleData,
      id: tempId,
      technicianId,
    };

    const daySchedules = weeklySchedule.filter(s => s.dayOfWeek === newSchedule.dayOfWeek);
    if (hasTimeConflict(daySchedules, newSchedule)) {
        toast.error('Time conflict detected with another time block.');
        return;
    }

    const finalSchedules = [...weeklySchedule, newSchedule];
    setWeeklySchedule(finalSchedules);
    handleCloseAddModal();
    updateScheduleOnBackend(finalSchedules);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    const updatedSchedules = weeklySchedule.filter(s => s.id !== scheduleId);
    setWeeklySchedule(updatedSchedules);
    handleCloseEditModal();
    updateScheduleOnBackend(updatedSchedules);
  };

  const getDaySchedules = (dayOfWeek: number) => {
    return weeklySchedule.filter(schedule => schedule.dayOfWeek === dayOfWeek);
  };

  const formatTime = (time: string) => {
    if (!time || typeof time !== 'string') return '';
    const [hour, minute] = time.split(':');
    if (!hour || !minute) return '';
    const hourNum = parseInt(hour, 10);
    const ampm = hourNum >= 12 ? 'pm' : 'am';
    const formattedHour = hourNum % 12 || 12;
    return `${formattedHour}:${minute} ${ampm}`;
  };

  const getDuration = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60); // duration in minutes
  }

  const groupConsecutiveExceptions = (exceptions: ScheduleException[]) => {
    if (exceptions.length === 0) return [];
    
    const sorted = [...exceptions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const groups = [];
    let currentGroup = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const previous = sorted[i - 1];
      
      if (!current || !previous) continue;
      
      const currentDate = new Date(current.date);
      const previousDate = new Date(previous.date);
      const dayDiff = (currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
      
      // Check if consecutive and same properties
      if (dayDiff === 1 && 
          current.isAvailable === previous.isAvailable &&
          current.reason === previous.reason &&
          current.startTime === previous.startTime &&
          current.endTime === previous.endTime) {
        currentGroup.push(current);
      } else {
        groups.push(currentGroup);
        currentGroup = [current];
      }
    }
    
    groups.push(currentGroup);
    return groups;
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    if (!hasMounted) return '';
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start.getTime() === end.getTime()) {
      return start.toLocaleDateString();
    }
    
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  };

  const getBlockColorStyles = (duration: number) => {
    if (duration <= 60) {
      return 'bg-purple-200 border-purple-400 text-purple-800 hover:bg-purple-100';
    } else if (duration <= 120) {
      return 'bg-green-200 border-green-400 text-green-800 hover:bg-green-100';
    } else {
      return 'bg-orange-200 border-orange-400 text-orange-800 hover:bg-orange-100';
    }
  };

  const getBlockHeightStyle = (duration: number) => {
    if (duration <= 60) {
      return 'h-20';
    } else if (duration <= 120) {
      return 'h-24';
    } else {
      return 'h-28';
    }
  };

  const handleDeleteExceptionGroup = async (exceptionIds: string[]) => {
    try {
      const response = await fetch('/api/schedule-exceptions/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: exceptionIds }),
      });

      if (!response.ok) throw new Error('Failed to delete exceptions');
      
      await fetchData();
      toast.success('Exceptions deleted successfully');
    } catch (error) {
      console.error('Error deleting exceptions:', error);
      toast.error('Failed to delete exceptions. Please try again.');
    }
  };

  const handleOpenEditExceptionModal = (group: ScheduleException[]) => {
    setEditingExceptionGroup(group);
    setIsEditExceptionModalOpen(true);
  };

  const handleCloseEditExceptionModal = () => {
    setIsEditExceptionModalOpen(false);
    setEditingExceptionGroup(null);
  };

  const handleUpdateExceptionGroup = async (updatedData: { 
    date: string; 
    endDate: string; 
    startTime: string; 
    endTime: string; 
    isAvailable: boolean; 
    reason: string | null 
  }) => {
    if (!editingExceptionGroup) return;

    try {
      // 1. Delete the old exception group
      const idsToDelete = editingExceptionGroup.map(e => e.id);
      await handleDeleteExceptionGroup(idsToDelete);

      // 2. Create new exceptions with the updated data (reusing the add logic)
      // This is a simplified approach. We'll directly call the POST endpoint multiple times.
      const startDate = new Date(updatedData.date);
      const endDate = updatedData.endDate ? new Date(updatedData.endDate) : startDate;

      const promises = [];
      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const exceptionData = {
          technicianId: session?.user?.id,
          date: new Date(d).toISOString().split('T')[0],
          startTime: updatedData.isAvailable ? updatedData.startTime : null,
          endTime: updatedData.isAvailable ? updatedData.endTime : null,
          isAvailable: updatedData.isAvailable,
          reason: updatedData.reason || null,
        };
        const promise = fetch('/api/schedule-exceptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(exceptionData),
        });
        promises.push(promise);
      }

      const responses = await Promise.all(promises);
      const hasError = responses.some(res => !res.ok);

      if (hasError) {
        throw new Error('Failed to create one or more exceptions in the updated group.');
      }
      
      toast.success('Exception group updated successfully!');
    } catch (error) {
      console.error('Error updating exception group:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update exception.');
    } finally {
      handleCloseEditExceptionModal();
      await fetchData(); // Refresh data from server
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-full md:max-w-4xl lg:max-w-7xl mx-auto space-y-8">
        {/* Weekly Availability Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-4 flex flex-col max-w-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-200 rounded"></div>
                      <div className="ml-2 h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-grow">
                    <div className="flex flex-col items-center w-8 mr-4">
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      <div className="flex-grow w-px bg-gray-300 my-1"></div>
                      <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-3 flex-grow">
                      {[1, 2].map((j) => (
                        <div key={j} className="p-3 rounded-lg border border-gray-200 bg-gray-100">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
                              <div className="h-3 bg-gray-200 rounded w-16"></div>
                            </div>
                            <div className="h-3 bg-gray-200 rounded w-8"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Exception Days Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-end">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-5 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-4 bg-gray-200 rounded w-40"></div>
                    <div className="h-4 bg-gray-200 rounded w-28"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full md:max-w-4xl lg:max-w-7xl mx-auto space-y-8">
        {/* Weekly Availability Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Availability</h2>
            <p className="text-base text-gray-500">Set your recurring schedule for each day of the week</p>
          </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {DAYS.map((day) => {
              const daySchedules = getDaySchedules(day.dayOfWeek);
              const isDayAvailable = daySchedules.some(s => s.isAvailable);
                
                return (
                <div key={day.dayOfWeek} className="bg-gray-50 rounded-xl p-4 flex flex-col max-w-md">
                    <div className="flex items-center justify-between mb-3">
                    <h3 className="text-md font-medium text-gray-900">{day.name}</h3>
                    <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={`${day.dayOfWeek}-available`}
                        checked={isDayAvailable}
                        onChange={(e) => handleAvailabilityToggle(day.dayOfWeek, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5 cursor-pointer"
                        />
                        <span className="ml-2 text-xs text-gray-600">Available</span>
                      </label>
                    </div>
                    
                  <div className="flex flex-grow">
                    <div className="flex flex-col items-center w-8 mr-4">
                      <SunIcon className="text-gray-400 h-5 w-5" />
                      <div className="flex-grow w-px bg-gray-300 my-1"></div>
                      <MoonIcon className="text-gray-400 h-5 w-5" />
                      </div>
                      
                    <div className="space-y-3 flex-grow">
                      {daySchedules.length > 0 ? (
                        daySchedules
                          .sort((a, b) => a.startTime.localeCompare(b.startTime))
                          .map((schedule, i) => {
                          const grayStyle = 'bg-gray-200 border-gray-300 text-gray-500';
                          const duration = getDuration(schedule.startTime, schedule.endTime);
                          let bgColor = '', textColor = '';
                          if (duration <= 60) {
                            bgColor = '#a78bfa22'; // pastel purple
                            textColor = '#6d28d9';
                          } else if (duration <= 120) {
                            bgColor = '#34d39922'; // pastel green
                            textColor = '#059669';
                          } else {
                            bgColor = '#fbbf2422'; // pastel orange
                            textColor = '#b45309';
                          }
                          return (
                            <div
                              key={i}
                              onClick={() => { if (isDayAvailable) { handleOpenEditModal(schedule) } }}
                              className={`p-3 rounded-md transition-colors duration-200 ${getBlockHeightStyle(duration)} ${
                                isDayAvailable ? 'cursor-pointer' : `${grayStyle} cursor-not-allowed`
                              }`}
                              style={isDayAvailable ? {
                                background: bgColor,
                                color: textColor,
                                fontSize: '0.97rem',
                                fontWeight: 500,
                                border: 'none',
                                boxShadow: 'none',
                              } : {}}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-bold">{schedule.blockName}</p>
                                  <p className="text-sm">
                                    {hasMounted ? `${formatTime(schedule.startTime)} - ${formatTime(schedule.endTime)}` : ''}
                                  </p>
                                </div>
                                <button type="button" onClick={() => {}} className="text-xs font-bold text-gray-600 cursor-pointer">EDIT</button>
                              </div>
                          </div>
                          );
                        })
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-gray-500">No time slots</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(day.dayOfWeek)} 
                      disabled={!isDayAvailable}
                      className={`py-1 px-3 text-sm rounded-lg ${isDayAvailable ? 'bg-blue-500 text-white hover:bg-blue-600 cursor-pointer' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    >
                      Add Slot
                    </button>
            </div>
                </div>
              );
            })}
          </div>
                </div>
              </div>

      <EditTimeBlockModal
        isOpen={isEditModalOpen}
        schedule={editingSchedule}
        onClose={handleCloseEditModal}
        onSave={handleSaveSchedule}
        onDelete={handleDeleteSchedule}
      />

      {editingExceptionGroup && (
        <EditExceptionModal
          isOpen={isEditExceptionModalOpen}
          onClose={handleCloseEditExceptionModal}
          onSave={handleUpdateExceptionGroup}
          exceptionGroup={editingExceptionGroup}
          allExceptions={scheduleExceptions}
        />
      )}

      {dayToAddTo !== null && (
        <AddTimeBlockModal 
          isOpen={isAddModalOpen}
          dayOfWeek={dayToAddTo}
          onClose={handleCloseAddModal}
          onSave={handleAddSchedule}
        />
          )}

        {/* Exception Days Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Exception Days</h2>
            <p className="text-base text-gray-500">Add vacation days, holidays, or special hours that override your regular schedule</p>
          </div>

          <div className="space-y-6">
            {/* Add Exception Form */}
            {showExceptionForm && (
              <div className="p-6 bg-orange-50 rounded-xl border border-orange-200">
                <h3 className="text-lg font-medium text-orange-900 mb-4">Add Exception Day</h3>
              <div className="space-y-4">
                {/* Date Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={newException.date}
                      onChange={(e) => setNewException({ ...newException, date: e.target.value })}
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">End Date (Optional)</label>
                    <input
                      type="date"
                      value={newException.endDate}
                      onChange={(e) => setNewException({ ...newException, endDate: e.target.value })}
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Availability Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={newException.isAvailable}
                    onChange={(e) => setNewException({ ...newException, isAvailable: e.target.checked })}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500 h-5 w-5 cursor-pointer"
                  />
                  <span className="ml-2 text-sm text-orange-800">Available on this day</span>
                </div>

                {/* Time Fields - Only shown when available */}
                {newException.isAvailable && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Start Time</label>
                    <input
                      type="time"
                      value={newException.startTime}
                      onChange={(e) => setNewException({ ...newException, startTime: e.target.value })}
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">End Time</label>
                    <input
                      type="time"
                      value={newException.endTime}
                      onChange={(e) => setNewException({ ...newException, endTime: e.target.value })}
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  </div>
                )}

                {/* Reason Field */}
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Reason</label>
                    <input
                      type="text"
                      placeholder="Vacation, Holiday, etc."
                      value={newException.reason || ''}
                      onChange={(e) => setNewException({ ...newException, reason: e.target.value })}
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExceptionForm(false);
                    setNewException({ date: '', endDate: '', startTime: '', endTime: '', isAvailable: true, reason: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-orange-700 hover:text-orange-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddException}
                    className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700"
                  >
                    Add Exception
                  </button>
                </div>
              </div>
            )}

            {/* Exception List */}
            <div className="space-y-4">
              {scheduleExceptions.length > 0 ? (
              groupConsecutiveExceptions(scheduleExceptions).map((group, groupIndex) => {
                const firstException = group[0];
                const lastException = group[group.length - 1];
                
                if (!firstException || !lastException) return null;
                
                return (
                  <div key={`${firstException.id}-${groupIndex}`} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4 min-w-0">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${firstException.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div className="min-w-0">
                        <div className="font-medium text-gray-900 truncate">
                          {formatDateRange(firstException.date, lastException.date)}
                          {firstException.startTime && firstException.endTime && hasMounted && (
                            <span className="ml-2 font-normal text-gray-500 text-sm">
                              ({formatTime(firstException.startTime)} - {formatTime(firstException.endTime)})
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {firstException.isAvailable ? 'Available' : 'Unavailable'}
                          {firstException.reason && <span className="ml-2 text-gray-400">• {firstException.reason}</span>}
                          {group.length > 1 && <span className="ml-2 text-gray-400">• {group.length} days</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => {
                          const validGroup = group.filter((e): e is ScheduleException => !!e);
                          if (validGroup.length > 0) {
                            handleOpenEditExceptionModal(validGroup);
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium cursor-pointer"
                      >
                        Edit
                      </button>
                    <button
                        onClick={() => handleDeleteExceptionGroup(group.map(e => e?.id).filter(Boolean) as string[])}
                        className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer flex-shrink-0"
                    >
                      Delete
                    </button>
                    </div>
                  </div>
                );
              })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No exception days set
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowExceptionForm(true)}
              className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 cursor-pointer"
              >
                Add Exception Day
              </button>
          </div>
        </div>
      </div>
    </div>
  );
} 