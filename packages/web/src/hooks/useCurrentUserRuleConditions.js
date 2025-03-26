import useCurrentUserAbility from 'hooks/useCurrentUserAbility';

export default function useCurrentUserRuleConditions() {
  const currentUserAbility = useCurrentUserAbility();

  return function canCurrentUser(action, subject) {
    const can = currentUserAbility.can(action, subject);

    if (!can) return false;

    const relevantRule = currentUserAbility.relevantRuleFor(action, subject);

    const conditions = relevantRule?.conditions || [];
    const conditionMap = Object.fromEntries(
      conditions.map((condition) => [condition, true]),
    );

    return conditionMap;
  };
}
