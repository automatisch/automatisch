const cronTimes = {
  everyHour: '0 * * * *',
  everyHourExcludingWeekends: '0 * * * 1-5',
  everyDayAt: (hour) => `0 ${hour} * * *`,
  everyDayExcludingWeekendsAt: (hour) => `0 ${hour} * * 1-5`,
  everyWeekOnAndAt: (weekday, hour) => `0 ${hour} * * ${weekday}`,
  everyMonthOnAndAt: (day, hour) => `0 ${hour} ${day} * *`,
};

export default cronTimes;
