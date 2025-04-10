import { describe, it, expect } from 'vitest';
import Permission from './permission';
import permissionCatalog from '../helpers/permission-catalog.ee.js';

describe('Permission model', () => {
  it('tableName should return correct name', () => {
    expect(Permission.tableName).toBe('permissions');
  });

  it('jsonSchema should have correct validations', () => {
    expect(Permission.jsonSchema).toMatchSnapshot();
  });

  it('filter should return only valid permissions based on permission catalog', () => {
    const permissions = [
      { action: 'read', subject: 'Flow', conditions: ['isCreator'] },
      { action: 'manage', subject: 'Connection', conditions: [] },
      { action: 'manage', subject: 'Flow', conditions: ['isCreator'] },
      { action: 'manage', subject: 'Execution', conditions: [] }, // Invalid subject
      { action: 'manage', subject: 'Execution', conditions: ['invalid'] }, // Invalid condition
      { action: 'invalid', subject: 'Execution', conditions: [] }, // Invalid action
    ];

    const result = Permission.filter(permissions);

    expect(result).toStrictEqual([
      { action: 'read', subject: 'Flow', conditions: ['isCreator'] },
      { action: 'manage', subject: 'Connection', conditions: [] },
      { action: 'manage', subject: 'Flow', conditions: ['isCreator'] },
    ]);
  });

  describe('findAction', () => {
    it('should return action from permission catalog', () => {
      const action = Permission.findAction('manage');
      expect(action.key).toStrictEqual('manage');
    });

    it('should return undefined for invalid actions', () => {
      const invalidAction = Permission.findAction('invalidAction');
      expect(invalidAction).toBeUndefined();
    });
  });

  describe('isSubjectValid', () => {
    it('should return true for valid subjects', () => {
      const validAction = permissionCatalog.actions.find(
        (action) => action.key === 'manage'
      );

      const validSubject = Permission.isSubjectValid('Connection', validAction);
      expect(validSubject).toBe(true);
    });

    it('should return false for invalid subjects', () => {
      const validAction = permissionCatalog.actions.find(
        (action) => action.key === 'manage'
      );

      const invalidSubject = Permission.isSubjectValid(
        'Execution',
        validAction
      );

      expect(invalidSubject).toBe(false);
    });
  });

  describe('areConditionsValid', () => {
    it('should return true for valid conditions', () => {
      const validConditions = Permission.areConditionsValid(['isCreator']);
      expect(validConditions).toBe(true);
    });

    it('should return false for invalid conditions', () => {
      const invalidConditions = Permission.areConditionsValid([
        'invalidCondition',
      ]);

      expect(invalidConditions).toBe(false);
    });
  });

  describe('isConditionValid', () => {
    it('should return true for valid conditions', () => {
      const validCondition = Permission.isConditionValid('isCreator');
      expect(validCondition).toBe(true);
    });

    it('should return false for invalid conditions', () => {
      const invalidCondition = Permission.isConditionValid('invalidCondition');
      expect(invalidCondition).toBe(false);
    });
  });
});
