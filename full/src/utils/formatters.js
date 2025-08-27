/**
 * A safe date formatter that falls back to extracting the year from a string.
 * This version includes console logs for debugging.
 */
export const formatDateSafe = (dateString) => {
  console.log(`[formatDateSafe] Received input:`, { dateString });

  if (!dateString) {
    console.log(`[formatDateSafe] Input is empty. Returning 'N/A'.`);
    return 'N/A';
  }

  const date = new Date(dateString);

  // Check if the date is valid.
  if (!isNaN(date.getTime())) {
    const formattedDate = date.toLocaleDateString('de-DE');
    console.log(`[formatDateSafe] Date is VALID. Returning formatted date:`, { formattedDate });
    return formattedDate;
  }

  // If invalid, try to find a four-digit year in the original string.
  console.log(`[formatDateSafe] Date is INVALID. Attempting to find year.`);
  const yearMatch = String(dateString).match(/\d{4}/);
  if (yearMatch) {
    const year = yearMatch[0];
    console.log(`[formatDateSafe] Found year: ${year}. Returning year.`);
    return year;
  }

  // If all else fails, return 'N/A'.
  console.log(`[formatDateSafe] Could not find year. Returning 'N/A'.`);
  return 'N/A';
};