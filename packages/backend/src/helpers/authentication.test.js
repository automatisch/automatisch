import { describe, it, expect } from 'vitest';
import { allow } from 'graphql-shield';
import { isAuthenticated, authenticationRules } from './authentication.js';
import { createUser } from '../../test/factories/user.js';
import createAuthTokenByUserId from '../helpers/create-auth-token-by-user-id.js';

describe('isAuthenticated', () => {
  it('should return false if no token is provided', async () => {
    const req = { headers: {} };
    expect(await isAuthenticated(null, null, req)).toBe(false);
  });

  it('should return false if token is invalid', async () => {
    const req = { headers: { authorization: 'invalidToken' } };
    expect(await isAuthenticated(null, null, req)).toBe(false);
  });

  it('should return true if token is valid and there is a user', async () => {
    const user = await createUser();
    const token = await createAuthTokenByUserId(user.id);

    const req = { headers: { authorization: token } };
    expect(await isAuthenticated(null, null, req)).toBe(true);
  });

  it('should return false if token is valid and but there is no user', async () => {
    const user = await createUser();
    const token = await createAuthTokenByUserId(user.id);
    await user.$query().delete();

    const req = { headers: { authorization: token } };
    expect(await isAuthenticated(null, null, req)).toBe(false);
  });
});

describe('authentication rules', () => {
  const getQueryAndMutationNames = (rules) => {
    const queries = Object.keys(rules.Query || {});
    const mutations = Object.keys(rules.Mutation || {});
    return { queries, mutations };
  };

  const { queries, mutations } = getQueryAndMutationNames(authenticationRules);

  if (queries.length) {
    describe('for queries', () => {
      queries.forEach((query) => {
        it(`should apply correct rule for query: ${query}`, () => {
          const ruleApplied = authenticationRules.Query[query];

          if (query === '*') {
            expect(ruleApplied.func).toBe(isAuthenticated);
          } else {
            expect(ruleApplied).toEqual(allow);
          }
        });
      });
    });
  }

  describe('for mutations', () => {
    mutations.forEach((mutation) => {
      it(`should apply correct rule for mutation: ${mutation}`, () => {
        const ruleApplied = authenticationRules.Mutation[mutation];

        if (mutation === '*') {
          expect(ruleApplied.func).toBe(isAuthenticated);
        } else {
          expect(ruleApplied).toBe(allow);
        }
      });
    });
  });
});
