import { parse, format, isValid } from 'date-fns';

/**
 * A highly reliable, cross-browser date formatter using date-fns.
 * @param {string} dateString The date string to format.
 * @returns {string} The formatted date ('dd.MM.yyyy'), the year ('yyyy'), or 'N/A'.
 */
export const formatDateSafe = (dateString) => {
  if (!dateString) {
    return 'N/A';
  }

  // Trim whitespace and ensure it's a string
  const dateStr = String(dateString).trim();

  // Define the date formats your data might be in, in order of preference.
  const formatsToTry = [
    'dd.MM.yyyy', // e.g., "28.08.2025"
    'yyyy-MM-dd', // e.g., "2025-08-28"
    'yyyy',       // e.g., "2024"
  ];

  // Loop through the formats and try to parse the date
  for (const fmt of formatsToTry) {
    const parsedDate = parse(dateStr, fmt, new Date());

    // If the parsed date is valid for the given format
    if (isValid(parsedDate)) {
      // If the format was just the year, return the original year string
      if (fmt === 'yyyy') {
        return dateStr;
      }
      // For all other valid formats, format it consistently
      return format(parsedDate, 'dd.MM.yyyy');
    }
  }

  // As a last resort, if no formats match, try to find any 4-digit number
  const yearMatch = dateStr.match(/\d{4}/);
  if (yearMatch) {
    return yearMatch[0];
  }

  return 'N/A'; // Return 'N/A' if nothing works
};