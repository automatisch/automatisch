import { PureAbility, fieldPatternMatcher, mongoQueryMatcher } from '@casl/ability';
import { IUser } from '@automatisch/types';

// Must be kept in sync with `packages/backend/src/helpers/user-ability.ts`!
export default function userAbility(user: IUser) {
  const permissions = user?.permissions;
  const role = user?.role;

  // We're not using mongo, but our fields, conditions match
  const options = {
    conditionsMatcher: mongoQueryMatcher,
    fieldMatcher: fieldPatternMatcher
  };

  if (!role || !permissions) {
    return new PureAbility([], options);
  }

  return new PureAbility<[string, string], string[]>(permissions, options);
}
