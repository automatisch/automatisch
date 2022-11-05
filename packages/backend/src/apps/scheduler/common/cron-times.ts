const cronTimes = {
  everyHour: '0 * * * *',
  everyHourExcludingWeekends: '0 * * * 1-5',
  everyDayAt: (hour: number) => `0 ${hour} * * *`,
  everyDayExcludingWeekendsAt: (hour: number) => `0 ${hour} * * 1-5`,
  everyWeekOnAndAt: (weekday: number, hour: number) =>
    `0 ${hour} * * ${weekday}`,
  everyMonthOnAndAt: (day: number, hour: number) => `0 ${hour} ${day} * *`,
};

export default cronTimes;
