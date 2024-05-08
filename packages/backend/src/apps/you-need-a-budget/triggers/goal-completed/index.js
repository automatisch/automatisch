import { DateTime } from 'luxon';
import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'Goal completed',
  key: 'goalCompleted',
  pollInterval: 15,
  description: 'Triggers when a goal is completed.',

  async run($) {
    const monthYear = DateTime.now().toFormat('MM-yyyy');
    const goalCompletedCategories = [];

    const response = await $.http.get('/budgets/default/categories');
    const categoryGroups = response.data.data.category_groups;

    categoryGroups.forEach((group) => {
      group.categories.forEach((category) => {
        if (category.goal_percentage_complete === 100) {
          goalCompletedCategories.push(category);
        }
      });
    });

    for (const category of goalCompletedCategories) {
      $.pushTriggerItem({
        raw: category,
        meta: {
        internalId: `${category.id}-${monthYear}`,
        },
      });
    }
  },
});
