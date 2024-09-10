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

  static sanitize(permissions) {
    const sanitizedPermissions = permissions.filter((permission) => {
      const { action, subject, conditions } = permission;

      const relevantAction = permissionCatalog.actions.find(
        (actionCatalogItem) => actionCatalogItem.key === action
      );
      const validSubject = relevantAction.subjects.includes(subject);
      const validConditions = conditions.every((condition) => {
        return !!permissionCatalog.conditions.find(
          (conditionCatalogItem) => conditionCatalogItem.key === condition
        );
      });

      return validSubject && validConditions;
    });

    return sanitizedPermissions;
  }
}

export default Permission;
