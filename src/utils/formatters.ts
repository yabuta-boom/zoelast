/**
 * Format a number as currency (ETB)
 */
export const formatCurrency = (value: number | undefined | null): string => {
  if (typeof value !== 'number') {
    return 'ETB 0';
  }
  return `ETB ${value.toLocaleString()}`; // Simple ETB prefix with number formatting
};

/**
 * Format a date string to a user-friendly format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};