import {
  PureAbility,
  fieldPatternMatcher,
  mongoQueryMatcher,
} from '@casl/ability';

// Must be kept in sync with `packages/backend/src/helpers/user-ability.js`!
export default function userAbility(user) {
  const permissions = user?.permissions;
  const role = user?.role;

  // We're not using mongo, but our fields, conditions match
  const options = {
    conditionsMatcher: mongoQueryMatcher,
    fieldMatcher: fieldPatternMatcher,
  };

  if (!role || !permissions) {
    return new PureAbility([], options);
  }

  if (role.isAdmin) {
    return new PureAbility([{ subject: 'all', action: 'manage' }], options);
  }

  return new PureAbility(permissions, options);
}
