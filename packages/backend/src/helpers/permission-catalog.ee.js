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

const permissionCatalog = {
  conditions: [
    {
      key: 'isCreator',
      label: 'Is creator'
    }
  ],
  actions: [
    {
      label: 'Create',
      key: 'create',
      subjects: [
        Connection.key,
        Flow.key,
      ]
    },
    {
      label: 'Read',
      key: 'read',
      subjects: [
        Connection.key,
        Execution.key,
        Flow.key,
      ]
    },
    {
      label: 'Update',
      key: 'update',
      subjects: [
        Connection.key,
        Flow.key,
      ]
    },
    {
      label: 'Delete',
      key: 'delete',
      subjects: [
        Connection.key,
        Flow.key,
      ]
    },
    {
      label: 'Publish',
      key: 'publish',
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

export default permissionCatalog;
