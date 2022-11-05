import { DateTime } from 'luxon';
import cronParser from 'cron-parser';

export default function getNextCronDateTime(cronString: string) {
  const cronDate = cronParser.parseExpression(cronString);
  const matchingNextCronDateTime = cronDate.next();
  const matchingNextDateTime = DateTime.fromJSDate(
    matchingNextCronDateTime.toDate()
  );

  return matchingNextDateTime;
}
