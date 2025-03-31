export async function up(knex) {
  const roles = await knex('roles').select('id', 'name');

  // Define the required actions for each subject
  const subjectActionMap = {
    Connection: ['create', 'delete', 'update'],
    Flow: ['create', 'delete', 'publish', 'update'],
    User: ['create', 'delete', 'update'],
    Role: ['create', 'delete', 'update'],
    SamlAuthProvider: ['create', 'delete', 'update'],
    Config: ['update'],
    App: ['create', 'delete', 'update'],
  };

  for (const role of roles) {
    for (const [subject, actions] of Object.entries(subjectActionMap)) {
      const rolePermissions = await knex('permissions')
        .where({ role_id: role.id, subject })
        .whereIn('action', actions)
        .select('id', 'action', 'conditions');

      const actionCounts = rolePermissions.reduce((counts, perm) => {
        counts[perm.action] = (counts[perm.action] || 0) + 1;
        return counts;
      }, {});

      let allActionsExist = true;
      for (const action of actions) {
        if (actionCounts[action] !== 1) {
          allActionsExist = false;
          break;
        }
      }

      // Determine if any of the permissions has the 'isCreator' condition
      const hasIsCreatorCondition = rolePermissions.some(
        (perm) => perm.conditions && perm.conditions.includes('isCreator')
      );

      // Delete the existing permissions for the required actions
      await knex('permissions')
        .where({ role_id: role.id, subject })
        .whereIn('action', actions)
        .del();

      // If all required actions exist, insert a new permission with the 'manage' action
      if (allActionsExist) {
        await knex('permissions').insert({
          role_id: role.id,
          subject,
          action: 'manage',
          conditions: JSON.stringify(
            hasIsCreatorCondition ? ['isCreator'] : []
          ),
        });
      }
    }
  }

  return;
}

export async function down(knex) {
  const roles = await knex('roles').select('id', 'name');

  // Define the required actions for each subject
  const subjectActionMap = {
    Connection: ['create', 'delete', 'update'],
    Flow: ['create', 'delete', 'publish', 'update'],
    User: ['create', 'delete', 'update'],
    Role: ['create', 'delete', 'update'],
    SamlAuthProvider: ['create', 'delete', 'update'],
    Config: ['update'],
    App: ['create', 'delete', 'update'],
  };

  for (const role of roles) {
    for (const [subject, actions] of Object.entries(subjectActionMap)) {
      // Find the 'manage' permission for the subject
      const managePermission = await knex('permissions')
        .where({ role_id: role.id, subject, action: 'manage' })
        .first();

      if (managePermission) {
        // Determine if the 'manage' permission has the 'isCreator' condition
        const hasIsCreatorCondition =
          managePermission.conditions.includes('isCreator');

        // Delete the 'manage' permission
        await knex('permissions')
          .where({ role_id: role.id, subject, action: 'manage' })
          .del();

        // Restore the original permissions for the subject
        const restoredPermissions = actions.map((action) => ({
          role_id: role.id,
          subject,
          action,
          conditions: JSON.stringify(
            hasIsCreatorCondition ? ['isCreator'] : []
          ),
        }));

        await knex('permissions').insert(restoredPermissions);
      }
    }
  }

  return;
}
