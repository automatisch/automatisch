const getPermissions = async () => {
  const Connection = {
    label: 'Connection',
    key: 'Connection',
  };

  const Flow = {
    label: 'Flow',
    key: 'Flow',
  };

  const Execution = {
    label: 'Execution',
    key: 'Execution',
  };

  const permissions = {
    conditions: [
      {
        key: 'isCreator',
        label: 'Is creator'
      }
    ],
    actions: [
      {
        label: 'Create',
        action: 'create',
        subjects: [
          Connection.key,
          Flow.key,
        ]
      },
      {
        label: 'Read',
        action: 'read',
        subjects: [
          Connection.key,
          Execution.key,
          Flow.key,
        ]
      },
      {
        label: 'Update',
        action: 'update',
        subjects: [
          Connection.key,
          Flow.key,
        ]
      },
      {
        label: 'Delete',
        action: 'delete',
        subjects: [
          Connection.key,
          Flow.key,
        ]
      },
      {
        label: 'Publish',
        action: 'publish',
        subjects: [
          Flow.key,
        ]
      }
    ],
    subjects: [
      Connection,
      Flow,
      Execution
    ]
  };

  return permissions;
};

export default getPermissions;
