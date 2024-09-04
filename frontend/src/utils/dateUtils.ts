export const formatDateToEastern = (dateString: string, timeString: string) => {
  const [year, month, day] = dateString.split('-');
  const [hours, minutes] = timeString.split(':');
  const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00Z`);
  
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