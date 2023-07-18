import { PureAbility, fieldPatternMatcher, mongoQueryMatcher } from '@casl/ability';
import type User from '../models/user'

// Must be kept in sync with `packages/web/src/helpers/userAbility.ts`!
export default function userAbility(user: Partial<User>) {
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
