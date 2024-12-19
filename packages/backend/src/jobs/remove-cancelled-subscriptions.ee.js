import { DateTime } from 'luxon';
import Subscription from '../models/subscription.ee.js';

export const removeCancelledSubscriptionsJob = async () => {
  await Subscription.query()
    .delete()
    .where({
      status: 'deleted',
    })
    .andWhere(
      'cancellation_effective_date',
      '<=',
      DateTime.now().startOf('day').toISODate()
    );
};
