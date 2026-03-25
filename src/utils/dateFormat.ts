/**
 * Global date and time formatting utilities for consistent display across the platform
 * Format: Full Month date, year global time (24-hour format with seconds)
 * Example: "January 15, 2024 14:30:45"
 */

export interface FormatOptions {
  includeYear?: boolean;
  includeSeconds?: boolean;
  use12Hour?: boolean;
}

/**
 * Formats a date to the global standard: "Full Month date, year time"
 * @param date - Date object or ISO string to format
 * @param options - Optional formatting preferences
 * @returns Formatted date string in the format "January 15, 2024 14:30:45"
 */
export function formatGlobalDateTime(date: Date | string, options: FormatOptions = {}): string {
  const {
    includeYear = true,
    includeSeconds = true,
    use12Hour = false
  } = options;
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format date part with full month name
  const dateOptions: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };
  
  if (includeYear) {
    dateOptions.year = 'numeric';
  }
  
  const datePart = dateObj.toLocaleDateString('en-US', dateOptions);
  
  // Format time part
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12Hour
  };
  
  if (includeSeconds) {
    timeOptions.second = '2-digit';
  }
  
  const timePart = dateObj.toLocaleTimeString('en-US', timeOptions);
  
  return `${datePart} ${timePart}`;
}

/**
 * Formats just the date part: "January 15" or "January 15, 2024"
 */
export function formatGlobalDate(date: Date | string, includeYear: boolean = true): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const options: Intl.DateTimeFormatOptions = {
    month: 'long',
    day: 'numeric',
  };
  
  if (includeYear) {
    options.year = 'numeric';
  }
  
  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Formats just the time part: "14:30:45" or "2:30:45 PM"
 */
export function formatGlobalTime(date: Date | string, options: { use12Hour?: boolean; includeSeconds?: boolean } = {}): string {
  const { use12Hour = false, includeSeconds = true } = options;
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: use12Hour
  };
  
  if (includeSeconds) {
    timeOptions.second = '2-digit';
  }
  
  return dateObj.toLocaleTimeString('en-US', timeOptions);
}

/**
 * Formats a date for display in the "Last Updated" bar
 */
export function formatLastUpdated(date: Date | string): string {
  return formatGlobalDateTime(date, { includeYear: true });
}

/**
 * Formats a date for table cells and log entries
 */
export function formatTableDateTime(date: Date | string): string {
  return formatGlobalDateTime(date);
}

/**
 * Formats a date for backup timestamps
 */
export function formatBackupDateTime(date: Date | string): string {
  return formatGlobalDateTime(date);
}
