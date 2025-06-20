'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

interface WeeklySchedule {
  id: string;
  technicianId: string;
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string;
  duration: number; // in minutes
  blockName: string;
  isAvailable: boolean;
}

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
  const [showExceptionForm, setShowExceptionForm] = useState(false);
  const [newException, setNewException] = useState({
    date: '',
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
      const response = await fetch('/api/schedule-exceptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newException,
          technicianId: session?.user?.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to add exception');
      
      await fetchData();
      setNewException({ date: '', startTime: '', endTime: '', isAvailable: true, reason: '' });
      setShowExceptionForm(false);
      toast.success('Exception added successfully');
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

  const getBlockStyles = (duration: number) => {
    if (duration <= 60) {
      return 'bg-purple-200 border-purple-400 h-20'; // Purple for <= 1 hour
    } else if (duration <= 120) {
      return 'bg-green-200 border-green-400 h-24'; // Green for 1-2 hours
    } else {
      return 'bg-orange-200 border-orange-400 h-28'; // Orange for > 2 hours
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-gray-600">Loading availability...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Weekly Availability Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Weekly Availability</h2>
            <p className="text-base text-gray-500">Set your recurring schedule for each day of the week</p>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {DAYS.map((day) => {
                const daySchedules = getDaySchedules(day.dayOfWeek);
                const isAvailable = daySchedules.length > 0 && daySchedules.some(s => s.isAvailable);

                return (
                  <div key={day.dayOfWeek} className="bg-gray-50 rounded-xl p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-900">{day.name}</h3>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name={`${day.dayOfWeek}-available`}
                          checked={isAvailable}
                          readOnly
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-xs text-gray-600">Available</span>
                      </label>
                    </div>

                    <div className="space-y-3 flex-grow">
                      {daySchedules.map((schedule, i) => {
                        const endTime = new Date(new Date(`1970-01-01T${schedule.startTime}`).getTime() + schedule.duration * 60000);
                        const endTimeString = isNaN(endTime.getTime()) ? '00:00' : endTime.toISOString().substr(11, 5);

                        return (
                          <div key={i} className={`p-3 rounded-lg border ${getBlockStyles(schedule.duration)}`}>
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-bold">{schedule.blockName}</p>
                                <p className="text-sm">
                                  {formatTime(schedule.startTime)} - {formatTime(endTimeString)}
                                </p>
                              </div>
                              <button type="button" onClick={() => {}} className="text-xs font-bold text-gray-600">EDIT</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button type="button" onClick={() => {}} className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                      Add Slot
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="button"
                disabled
                className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Pre-booking Padding Settings */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pre-booking Padding Settings</h2>
            <p className="text-base text-gray-500">Set your pre-booking padding settings</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Slot Duration (minutes)
              </label>
              <input
                type="number"
                defaultValue={technician?.defaultSlotDurationMinutes ?? 60}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Buffer (minutes)
              </label>
              <input
                type="number"
                defaultValue={technician?.defaultBufferMinutes ?? 15}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={() => {
                handlePaddingUpdate(
                  technician?.defaultSlotDurationMinutes || 60,
                  technician?.defaultBufferMinutes || 15
                );
              }}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Update Padding
            </button>
          </div>
        </div>

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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-orange-800 mb-2">Date</label>
                    <input
                      type="date"
                      value={newException.date}
                      onChange={(e) => setNewException({ ...newException, date: e.target.value })}
                      className="w-full border border-orange-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
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
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    checked={newException.isAvailable}
                    onChange={(e) => setNewException({ ...newException, isAvailable: e.target.checked })}
                    className="rounded border-orange-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="ml-2 text-sm text-orange-800">Available on this day</span>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowExceptionForm(false);
                      setNewException({ date: '', startTime: '', endTime: '', isAvailable: true, reason: '' });
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
                scheduleExceptions.map((exception) => (
                  <div key={exception.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${exception.isAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {new Date(exception.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-sm text-gray-500">
                          {exception.isAvailable 
                            ? `${exception.startTime || 'All day'} - ${exception.endTime || 'All day'}`
                            : 'Not available'
                          }
                          {exception.reason && ` • ${exception.reason}`}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteException(exception.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))
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
                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Add Exception Day
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 