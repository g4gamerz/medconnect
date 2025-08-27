/**
 * A safe, cross-browser date formatter that handles multiple formats
 * and falls back to extracting the year from a string.
 * @param {string} dateString The date string to format (e.g., "2025-08-28", "28.08.2025", or "2024").
 * @returns {string} The formatted date ('DD.MM.YYYY'), the extracted year ('YYYY'), or 'N/A'.
 */
export const formatDateSafe = (dateString) => {
  if (!dateString) return 'N/A';

  // Ensure the input is a string to use .match()
  const dateStr = String(dateString);

  // --- NEW CROSS-BROWSER LOGIC ---
  // Check for German/European date format (DD.MM.YYYY)
  const germanDateMatch = dateStr.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  let parsableDateString = dateStr;

  if (germanDateMatch) {
    const day = germanDateMatch[1];
    const month = germanDateMatch[2];
    const year = germanDateMatch[3];
    // Rearrange to the universally supported YYYY-MM-DD format
    parsableDateString = `${year}-${month}-${day}`;
  }
  // --- END OF NEW LOGIC ---

  // Now, use the original or the rearranged string to create the date
  const date = new Date(parsableDateString);

  // Check if the date is valid.
  if (!isNaN(date.getTime())) {
    // If valid, return the full formatted date.
    return date.toLocaleDateString('de-DE');
  }

  // If invalid, fall back to finding a four-digit year in the original string.
  const yearMatch = dateStr.match(/\d{4}/);
  if (yearMatch) {
    // If a year is found, return it.
    return yearMatch[0];
  }

  // If all else fails, return 'N/A'.
  return 'N/A';
};