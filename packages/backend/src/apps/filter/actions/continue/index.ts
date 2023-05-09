import defineAction from '../../../../helpers/define-action';

type TGroupItem = {
  key: string;
  operator: keyof TOperators;
  value: string;
  id: string;
}

type TGroup = Record<'and', TGroupItem[]>;

const isEqual = (a: string, b: string) => a === b;
const isNotEqual = (a: string, b: string) => !isEqual(a, b);
const isGreaterThan = (a: string, b: string) => Number(a) > Number(b);
const isLessThan = (a: string, b: string) => Number(a) < Number(b);
const isGreaterThanOrEqual = (a: string, b: string) => Number(a) >= Number(b);
const isLessThanOrEqual = (a: string, b: string) => Number(a) <= Number(b);
const contains = (a: string, b: string) => a.includes(b);
const doesNotContain = (a: string, b: string) => !contains(a, b);

const shouldContinue = (orGroups: TGroup[]) => {
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
}

type TOperatorFunc = (a: string, b: string) => boolean;

type TOperators = {
  equal: TOperatorFunc;
  not_equal: TOperatorFunc;
  greater_than: TOperatorFunc;
  less_than: TOperatorFunc;
  greater_than_or_equal: TOperatorFunc;
  less_than_or_equal: TOperatorFunc;
  contains: TOperatorFunc;
  not_contains: TOperatorFunc;
};

const operators: TOperators = {
  'equal': isEqual,
  'not_equal': isNotEqual,
  'greater_than': isGreaterThan,
  'less_than': isLessThan,
  'greater_than_or_equal': isGreaterThanOrEqual,
  'less_than_or_equal': isLessThanOrEqual,
  'contains': contains,
  'not_contains': doesNotContain,
};

const operate = (operation: keyof TOperators, a: string, b: string) => {
  return operators[operation](a, b);
};

export default defineAction({
  name: 'Continue if conditions match',
  key: 'continueIfMatches',
  description: 'Let the execution continue if the conditions match',
  arguments: [],

  async run($) {
    const orGroups = $.step.parameters.or as TGroup[];

    const matchingGroups = orGroups.reduce((groups, group) => {
      const matchingConditions = group.and
        .filter((condition) => operate(condition.operator, condition.key, condition.value));

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
      }
    });
  },
});
