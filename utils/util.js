const toHoursAndMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const totalHoursAndMinutes = hours + minutes / 60; // Calculate total hours + minutes
  return {
    hours,
    minutes,
    totalHoursAndMinutes, // Return total hours + minutes
  };
};

const getLastSundayOfMonth = (month, year, shiftDays = null) => {
  // Create a new date object for the first day of the next month
  let firstDayOfNextMonth = new Date(year, month - 1 + 1, 1);
  // Subtract one day to get the last day of the current month
  let lastDayOfMonth = new Date(firstDayOfNextMonth - 24 * 60 * 60 * 1000);
  // Find the day of the week for the last day of the month (0 - Sunday, 1 - Monday, etc.)
  let lastDayOfWeek = lastDayOfMonth.getDay();
  // Calculate the number of days to subtract to get the last Sunday
  let daysToSubtract = (lastDayOfWeek + 7 - 0) % 7;
  // Subtract the number of days to get the last Sunday of the month
  let lastSundayOfMonth = new Date(
    lastDayOfMonth - daysToSubtract * 24 * 60 * 60 * 1000
  );
  // Set the time to the end of the day (23:59:59)
  lastSundayOfMonth.setHours(23, 59, 59);
  // Check if shift days is set then shift the date by shift days
  if (shiftDays) {
    lastSundayOfMonth.setDate(lastSundayOfMonth.getDate() + shiftDays);
  }
  return lastSundayOfMonth;
};

const getWeeklyRanges = (startDate, endDate) => {
  const weeklyRanges = [];
  // Adjust the startDate to the nearest Monday
  startDate = new Date(startDate);
  const startDay = startDate.getDay();
  const diff = startDate.getDate() - startDay + (startDay === 0 ? -6 : 1);
  startDate.setDate(diff);
  while (startDate <= endDate) {
    const date_from = new Date(startDate);
    date_from.setHours(0, 0, 0);
    const date_to = new Date(startDate);
    date_to.setDate(date_from.getDate() + 6);
    date_to.setHours(23, 59, 59);
    weeklyRanges.push({
      range: `${formatDate(date_from)} to ${formatDate(date_to)}`,
      date_from: dateToUnixTimestamp(date_from),
      date_to: dateToUnixTimestamp(date_to),
    });
    // Increment startDate for the next week
    startDate.setDate(startDate.getDate() + 7);
  }
  return weeklyRanges;
};

const dateToUnixTimestamp = (date) => {
  return Math.floor(date.valueOf() / 1000);
};

const unixTimestampToDate = (timestamp) => {
  return new Date(timestamp * 1000);
};

const formatDate = (date) =>
  date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

module.exports = {
  toHoursAndMinutes,
  getLastSundayOfMonth,
  getWeeklyRanges,
  dateToUnixTimestamp,
  unixTimestampToDate,
};
