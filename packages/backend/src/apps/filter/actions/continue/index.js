import defineAction from '../../../../helpers/define-action.js';

const isEqual = (a, b) => a === b;
const isNotEqual = (a, b) => !isEqual(a, b);
const isGreaterThan = (a, b) => Number(a) > Number(b);
const isLessThan = (a, b) => Number(a) < Number(b);
const isGreaterThanOrEqual = (a, b) => Number(a) >= Number(b);
const isLessThanOrEqual = (a, b) => Number(a) <= Number(b);
const contains = (a, b) => a.includes(b);
const doesNotContain = (a, b) => !contains(a, b);

const shouldContinue = (orGroups) => {
  let atLeastOneGroupMatches = false;

  for (const group of orGroups) {
    let groupMatches = true;

    for (const condition of group.and) {
      const conditionMatches = operate(
        condition.operator,
        condition.key,
        condition.value
      );

      if (!conditionMatches) {
        groupMatches = false;

        break;
      }
    }

    if (groupMatches) {
      atLeastOneGroupMatches = true;

      break;
    }
  }

  return atLeastOneGroupMatches;
};

const operators = {
  equal: isEqual,
  not_equal: isNotEqual,
  greater_than: isGreaterThan,
  less_than: isLessThan,
  greater_than_or_equal: isGreaterThanOrEqual,
  less_than_or_equal: isLessThanOrEqual,
  contains: contains,
  not_contains: doesNotContain,
};

const operate = (operation, a, b) => {
  return operators[operation](a, b);
};

export default defineAction({
  name: 'Continue if conditions match',
  key: 'continueIfMatches',
  description: 'Let the execution continue if the conditions match',
  arguments: [],

  async run($) {
    const orGroups = $.step.parameters.or;

    const matchingGroups = orGroups.reduce((groups, group) => {
      const matchingConditions = group.and.filter((condition) =>
        operate(condition.operator, condition.key, condition.value)
      );

      if (matchingConditions.length) {
        return groups.concat([{ and: matchingConditions }]);
      }

      return groups;
    }, []);

    if (!shouldContinue(orGroups)) {
      $.execution.exit();
    }

    $.setActionItem({
      raw: {
        or: matchingGroups,
      },
    });
  },
});
