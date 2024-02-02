import Role from '../../models/role.js';
import Permission from '../../models/permission.js';
import permissionCatalog from '../../helpers/permission-catalog.ee.js';

const updateRole = async (_parent, params, context) => {
  context.currentUser.can('update', 'Role');

  const { id, name, description, permissions } = params.input;

  const role = await Role.query().findById(id).throwIfNotFound();

  try {
    const updatedRole = await Role.transaction(async (trx) => {
      await role.$relatedQuery('permissions', trx).delete();

      if (permissions?.length) {
        const sanitizedPermissions = permissions
          .filter((permission) => {
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
          })
          .map((permission) => ({
            ...permission,
            roleId: role.id,
          }));

        await Permission.query().insert(sanitizedPermissions);
      }

      await role.$query(trx).patch({
        name,
        description,
      });

      return await Role.query(trx)
        .leftJoinRelated({
          permissions: true,
        })
        .withGraphFetched({
          permissions: true,
        })
        .findById(id);
    });

    return updatedRole;
  } catch (err) {
    throw new Error('The role could not be updated!');
  }
};

export default updateRole;
