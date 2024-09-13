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