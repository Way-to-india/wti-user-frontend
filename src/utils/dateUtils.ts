/**
 * Formats a Date object to an ISO string with only the date part (YYYY-MM-DD)
 * This is useful for sending dates to APIs that expect date strings without time
 * 
 * @param date The Date object to format
 * @returns A string in the format YYYY-MM-DD
 */
export function formatDateForAPI(date: Date | null): string {
  if (!date) return '';
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Formats a Date object for display in the UI
 * 
 * @param date The Date object or string to format
 * @param includeDay Whether to include the day of week in the output
 * @returns A formatted date string
 */
export function formatDateForDisplay(date: Date | string | null | undefined, includeDay = true): string {
  if (!date) return 'N/A';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  if (includeDay) {
    options.weekday = 'short';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Calculates the number of nights between two dates
 * 
 * @param checkInDate The check-in date
 * @param checkOutDate The check-out date
 * @returns The number of nights (minimum 1)
 */
export function calculateNights(checkInDate: Date | null, checkOutDate: Date | null): number {
  if (!checkInDate || !checkOutDate) return 1;
  
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  return Math.max(1, nights);
}

/**
 * Converts a Firestore timestamp to a JavaScript Date object
 * 
 * @param timestamp The timestamp which could be a Firestore format with _seconds and _nanoseconds
 * @returns A JavaScript Date object
 */
export function convertFirestoreTimestamp(timestamp: any): Date {
  if (!timestamp) return new Date();
  
  // If it's already a Date object
  if (timestamp instanceof Date) return timestamp;
  
  // If it's a string, try to parse it
  if (typeof timestamp === 'string') return new Date(timestamp);
  
  // If it has _seconds and _nanoseconds (Firestore timestamp)
  if (typeof timestamp === 'object' && timestamp._seconds !== undefined) {
    return new Date(timestamp._seconds * 1000);
  }
  
  // Fallback
  return new Date(timestamp);
}
