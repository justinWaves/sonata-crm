// Date and time utility functions for conflict detection

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface TimeRange {
  startTime: string;
  endTime: string;
}

export interface ExceptionConflict {
  type: 'date_overlap' | 'time_overlap' | 'both';
  message: string;
}

/**
 * Check if two date ranges overlap
 */
export function hasDateOverlap(range1: DateRange, range2: DateRange): boolean {
  return range1.startDate <= range2.endDate && range2.startDate <= range1.endDate;
}

/**
 * Check if two time ranges overlap (assumes same day)
 */
export function hasTimeOverlap(time1: TimeRange, time2: TimeRange): boolean {
  const start1 = new Date(`1970-01-01T${time1.startTime}`);
  const end1 = new Date(`1970-01-01T${time1.endTime}`);
  const start2 = new Date(`1970-01-01T${time2.startTime}`);
  const end2 = new Date(`1970-01-01T${time2.endTime}`);
  
  return start1 < end2 && start2 < end1;
}

/**
 * Check if a new exception conflicts with existing exceptions
 */
export function checkExceptionConflict(
  newException: {
    startDate: Date;
    endDate: Date;
    startTime: string | null;
    endTime: string | null;
    isAvailable: boolean;
  },
  existingExceptions: Array<{
    date: Date;
    startTime: string | null;
    endTime: string | null;
    isAvailable: boolean;
  }>
): ExceptionConflict | null {
  const newRange: DateRange = {
    startDate: new Date(newException.startDate),
    endDate: new Date(newException.endDate)
  };

  for (const existing of existingExceptions) {
    const existingRange: DateRange = {
      startDate: new Date(existing.date),
      endDate: new Date(existing.date) // Single day for existing
    };

    // Check date overlap
    if (hasDateOverlap(newRange, existingRange)) {
      // If both are available and have time ranges, check time overlap
      if (newException.isAvailable && existing.isAvailable && 
          newException.startTime && newException.endTime &&
          existing.startTime && existing.endTime) {
        
        if (hasTimeOverlap(
          { startTime: newException.startTime, endTime: newException.endTime },
          { startTime: existing.startTime, endTime: existing.endTime }
        )) {
          return {
            type: 'both',
            message: 'Exception conflicts with existing available time on overlapping dates'
          };
        }
      } else if (newException.isAvailable !== existing.isAvailable) {
        return {
          type: 'date_overlap',
          message: 'Exception conflicts with existing exception on overlapping dates'
        };
      }
    }
  }

  return null;
}

/**
 * Format date range for display
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  if (startDate.getTime() === endDate.getTime()) {
    return startDate.toLocaleDateString();
  }
  return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
}

/**
 * Validate time range (start time before end time)
 */
export function validateTimeRange(startTime: string, endTime: string): boolean {
  const start = new Date(`1970-01-01T${startTime}`);
  const end = new Date(`1970-01-01T${endTime}`);
  return start < end;
} 