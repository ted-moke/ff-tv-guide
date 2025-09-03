
export function getMostRecentKeyTime(): Date | null {
    const keyTimes = [
      { day: 1, time: "07:00" }, // Monday
      { day: 1, time: "14:00" },
      { day: 1, time: "19:00" },
      { day: 1, time: "23:00" },
      { day: 2, time: "07:00" }, // Tuesday
      { day: 2, time: "17:00" },
      { day: 3, time: "07:00" }, // Wednesday
      { day: 4, time: "07:00" }, // Thursday
      { day: 4, time: "14:00" },
      { day: 4, time: "19:00" },
      { day: 4, time: "23:00" },
      { day: 5, time: "00:00" }, // Friday
      { day: 5, time: "01:00" },
      { day: 5, time: "02:00" },
      { day: 6, time: "07:00" }, // Saturday
      { day: 6, time: "14:00" },
      { day: 6, time: "23:00" },
      { day: 0, time: "07:00" }, // Sunday
      { day: 0, time: "08:00" },
      { day: 0, time: "09:00" },
      { day: 0, time: "10:00" },
      { day: 0, time: "11:00" },
      { day: 0, time: "12:00" },
      { day: 0, time: "13:00" },
      { day: 0, time: "14:00" },
      { day: 0, time: "15:00" },
      { day: 0, time: "16:00" },
      { day: 0, time: "17:00" },
      { day: 0, time: "18:00" },
      { day: 0, time: "19:00" },
      { day: 0, time: "20:00" },
      { day: 0, time: "21:00" },
      { day: 0, time: "22:00" },
      { day: 0, time: "23:00" },
    ];
  
    const now = new Date();
    const currentDay = now.getUTCDay();
    const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes();
  
    let mostRecentKeyTime: Date | null = null;
  
    // First, check for key times on the current day
    for (const { time } of keyTimes.filter((kt) => kt.day === currentDay)) {
      const [hours, minutes] = time.split(":").map(Number);
      const keyTimeInMinutes = hours * 60 + minutes;
  
      if (keyTimeInMinutes <= currentTime) {
        const keyTimeDate = new Date(now);
        keyTimeDate.setUTCHours(hours, minutes, 0, 0);
        if (!mostRecentKeyTime || keyTimeDate > mostRecentKeyTime) {
          mostRecentKeyTime = keyTimeDate;
        }
      }
    }
  
    // If no key time found today, check previous days
    if (!mostRecentKeyTime) {
      for (let i = 1; i <= 7; i++) {
        const previousDay = (currentDay - i + 7) % 7;
        const previousDayKeyTimes = keyTimes.filter(
          (kt) => kt.day === previousDay,
        );
  
        if (previousDayKeyTimes.length > 0) {
          const lastKeyTime = previousDayKeyTimes[previousDayKeyTimes.length - 1];
          const [hours, minutes] = lastKeyTime.time.split(":").map(Number);
          mostRecentKeyTime = new Date(now);
          mostRecentKeyTime.setUTCDate(now.getUTCDate() - i);
          mostRecentKeyTime.setUTCHours(hours, minutes, 0, 0);
        }
      }
    }
  
    return mostRecentKeyTime;
  }
  