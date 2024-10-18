import Base from './base.js';
import permissionCatalog from '../helpers/permission-catalog.ee.js';

class Permission extends Base {
  static tableName = 'permissions';

  static jsonSchema = {
    type: 'object',
    required: ['roleId', 'action', 'subject'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      roleId: { type: 'string', format: 'uuid' },
      action: { type: 'string', minLength: 1 },
      subject: { type: 'string', minLength: 1 },
      conditions: { type: 'array', items: { type: 'string' } },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static filter(permissions) {
    const sanitizedPermissions = permissions.filter((permission) => {
      const { action, subject, conditions } = permission;

      const relevantAction = this.findAction(action);
      const validSubject = this.isSubjectValid(subject, relevantAction);
      const validConditions = this.areConditionsValid(conditions);

      return relevantAction && validSubject && validConditions;
    });

    return sanitizedPermissions;
  }

  static findAction(action) {
    return permissionCatalog.actions.find(
      (actionCatalogItem) => actionCatalogItem.key === action
    );
  }

  static isSubjectValid(subject, action) {
    return action && action.subjects.includes(subject);
  }

  static areConditionsValid(conditions) {
    return conditions.every((condition) => this.isConditionValid(condition));
  }

  static isConditionValid(condition) {
    return !!permissionCatalog.conditions.find(
      (conditionCatalogItem) => conditionCatalogItem.key === condition
    );
  }
}

export default Permission;
