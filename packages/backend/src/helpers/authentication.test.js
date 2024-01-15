import { describe, it, expect, vi } from 'vitest';
import { allow } from 'graphql-shield';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { isAuthenticated, authenticationRules } from './authentication.js';

vi.mock('jsonwebtoken');
vi.mock('../models/user.js');

describe('isAuthenticated', () => {
  it('should return false if no token is provided', async () => {
    const req = { headers: {} };
    expect(await isAuthenticated(null, null, req)).toBe(false);
  });

  it('should return false if token is invalid', async () => {
    jwt.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    const req = { headers: { authorization: 'invalidToken' } };
    expect(await isAuthenticated(null, null, req)).toBe(false);
  });

  it('should return true if token is valid', async () => {
    jwt.verify.mockReturnValue({ userId: '123' });

    User.query.mockReturnValue({
      findById: vi.fn().mockReturnValue({
        leftJoinRelated: vi.fn().mockReturnThis(),
        withGraphFetched: vi
          .fn()
          .mockResolvedValue({ id: '123', role: {}, permissions: {} }),
      }),
    });

    const req = { headers: { authorization: 'validToken' } };
    expect(await isAuthenticated(null, null, req)).toBe(true);
  });
});

describe('authentication rules', () => {
  const getQueryAndMutationNames = (rules) => {
    const queries = Object.keys(rules.Query || {});
    const mutations = Object.keys(rules.Mutation || {});
    return { queries, mutations };
  };

  const { queries, mutations } = getQueryAndMutationNames(authenticationRules);

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
