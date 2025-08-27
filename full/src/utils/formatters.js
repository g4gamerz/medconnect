import { parse, format, isValid, parseISO } from 'date-fns';

/**
 * A highly reliable date formatter that handles multiple potential date formats.
 * It formats valid full dates to 'dd.MM.yyyy', returns year-only strings as is,
 * and returns 'N/A' for invalid or empty inputs.
 * @param {string} dateString The date string to format.
 * @returns {string} The formatted date, the year, or 'N/A'.
 */
export const formatDateSafe = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  // Clean the string: trim whitespace and remove trailing junk like '--'
  const cleanedDateStr = String(dateString).trim().replace(/--$/, '');

  // Handle year-only case first for clarity and efficiency
  if (/^\d{4}$/.test(cleanedDateStr)) {
    return cleanedDateStr;
  }
  
  // Attempt to parse as ISO 8601 format (e.g., '2025-08-07') first, as it's common and robust.
  // This also correctly handles month names like '2025-Aug-07' automatically.
  const isoDate = parseISO(cleanedDateStr);
  if (isValid(isoDate)) {
    return format(isoDate, 'dd.MM.yyyy');
  }

  // Define other specific formats your data might be in.
  const formatsToTry = [
    'dd.MM.yyyy', // e.g., "28.08.2025"
  ];

  for (const fmt of formatsToTry) {
    // We use a reference date of Jan 1, 1970 to avoid borrowing the current date's values
    const parsedDate = parse(cleanedDateStr, fmt, new Date(0)); 
    if (isValid(parsedDate)) {
      return format(parsedDate, 'dd.MM.yyyy');
    }
  }

  // If no formats match, return 'N/A'.
  return 'N/A';
};