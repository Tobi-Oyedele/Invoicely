/**
 * Formats an ISO date string into a readable date format: e.g. "28 May, 2026"
 * @param dateString - The ISO date string or raw date value to format
 * @returns The formatted date string, or empty string/raw input if invalid
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return "";
  try {
    // Date-only strings parse as UTC midnight, which shows the previous day
    // west of UTC. Build them as local dates instead.
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
    const date = dateOnly
      ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
      : new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const day = date.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
  } catch {
    return dateString || "";
  }
};
