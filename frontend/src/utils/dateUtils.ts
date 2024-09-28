export const formatDateToEastern = (dateString: string, timeString: string) => {
  const [year, month, day] = dateString.split('-');
  const [hours, minutes] = timeString.split(':');
  
  // Create a temporary date to check for DST
  const tempDate = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
  
  // Check if the date is in DST
  const isDST = !!new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'short'
  }).format(tempDate).match(/EDT/);

  // Create date in Eastern Time, adjusting for DST
  const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00${isDST ? '-04:00' : '-05:00'}`);

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }).format(date);
};

export function formatDateToDay(dateString: string): string {
  // Parse the date string
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create a temporary date to check for DST
  const tempDate = new Date(Date.UTC(year, month - 1, day));
  
  // Check if the date is in DST
  const isDST = !!new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    timeZoneName: 'short'
  }).format(tempDate).match(/EDT/);

  // Create date in Eastern Time, adjusting for DST
  const date = new Date(Date.UTC(year, month - 1, day, isDST ? 20 : 21)); // 8 PM or 9 PM UTC of the previous day

  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short'
  }).format(date);
}