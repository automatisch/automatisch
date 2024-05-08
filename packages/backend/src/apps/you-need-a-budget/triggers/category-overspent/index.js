import { DateTime } from 'luxon';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Category overspent',
  key: 'categoryOverspent',
  pollInterval: 15,
  description:
    'Triggers when a category exceeds its budget, resulting in a negative balance.',

  async run($) {
    const monthYear = DateTime.now().toFormat('MM-yyyy');
    const categoryWithNegativeBalance = [];

    const response = await $.http.get('/budgets/default/categories');
    const categoryGroups = response.data.data.category_groups;

    categoryGroups.forEach((group) => {
      group.categories.forEach((category) => {
        if (category.balance < 0) {
          categoryWithNegativeBalance.push(category);
        }
      });
    });

    for (const category of categoryWithNegativeBalance) {
      $.pushTriggerItem({
        raw: category,
        meta: {
          internalId: `${category.id}-${monthYear}`,
        },
      });
    }
  },
});
