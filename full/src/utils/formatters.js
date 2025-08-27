import { parse, format, isValid } from 'date-fns';

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

  // Handle explicit year-only strings first for clarity and efficiency
  if (/^\d{4}$/.test(cleanedDateStr)) {
    return cleanedDateStr;
  }
  
  // Define the date formats your data might be in, in order of most to least specific.
  const formatsToTry = [
    'yyyy-MM-dd',   // For "2025-08-07"
    'yyyy-MMM-dd',  // For "2025-Aug-07"
    'dd.MM.yyyy',   // For "07.08.2025"
  ];

  for (const fmt of formatsToTry) {
    // The reference date (new Date()) is necessary for parse to work.
    // It doesn't affect the outcome here since our formats are complete.
    const parsedDate = parse(cleanedDateStr, fmt, new Date()); 
    if (isValid(parsedDate)) {
      // Check if the parsed year is reasonable to avoid date-fns fallbacks to current date
      if (parsedDate.getFullYear() > 1900) {
        return format(parsedDate, 'dd.MM.yyyy');
      }
    }
  }
  
  // As a final fallback, if a string like "2025 some other text" exists,
  // extract the year.
  const yearMatch = cleanedDateStr.match(/\d{4}/);
  if (yearMatch) {
    return yearMatch[0];
  }

  return 'N/A';
};