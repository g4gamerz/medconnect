/**
 * A safe date formatter that falls back to extracting the year from a string.
 * @param {string} dateString The date string to format (e.g., "2023-10-26", "2024", or "2022--05").
 * @returns {string} The formatted date ('DD.MM.YYYY'), the extracted year ('YYYY'), or 'N/A'.
 */
export const formatDateSafe = (dateString) => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  // Check if the date is valid.
  if (!isNaN(date.getTime())) {
    // If valid, return the full formatted date.
    return date.toLocaleDateString('de-DE');
  }

  // If invalid, try to find a four-digit year in the original string.
  const yearMatch = dateString.match(/\d{4}/);
  if (yearMatch) {
    // If a year is found, return it.
    return yearMatch[0];
  }

  // If all else fails, return 'N/A'.
  return 'N/A';
};