export function getRoleWithComputedPermissions(role) {
  if (!role) return {};
  const computedPermissions = role.permissions?.reduce(
    (computedPermissions, permission) => ({
      ...computedPermissions,
      [permission.subject]: {
        ...(computedPermissions[permission.subject] || {}),
        [permission.action]: {
          allEntities: permission.conditions.includes('isCreator') === false,
          ownEntities: true,
        },
      },
    }),
    {},
  );

  return {
    ...role,
    computedPermissions,
  };
}
export function getPermissions(computedPermissions) {
  if (!computedPermissions) return [];

  return Object.entries(computedPermissions).reduce(
    (permissions, computedPermissionEntry) => {
      const [subject, actionsWithConditions] = computedPermissionEntry;
      for (const action in actionsWithConditions) {
        const { ownEntities, allEntities } = actionsWithConditions[action];

        if (ownEntities && !allEntities) {
          permissions.push({
            action,
            subject,
            conditions: ['isCreator'],
          });
        } else if (ownEntities && allEntities) {
          permissions.push({
            action,
            subject,
            conditions: [],
          });
        }
      }
      return permissions;
    },
    [],
  );
}

export const getComputedPermissionsDefaultValues = (data) => {
  if (!data) return {};

  const result = {};

  data.subjects.forEach((subject) => {
    const subjectKey = subject.key;
    result[subjectKey] = {};

    data.actions.forEach((action) => {
      const actionKey = action.key;

      if (action.subjects.includes(subjectKey)) {
        result[subjectKey][actionKey] = {
          ownEntities: false,
          allEntities: false,
        };
      }
    });
  });

  return result;
};
