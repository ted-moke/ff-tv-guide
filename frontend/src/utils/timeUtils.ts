export function format24HourTo12Hour(time: string): string {
  let [hours, minutes] = time.split(":").map(Number);

  if (!hours) {
    return time;
  }

  if (!minutes) {
    minutes = 0;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}
