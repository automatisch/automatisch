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
      label: 'Is creator',
    },
  ],
  actions: [
    {
      label: 'Manage',
      key: 'manage',
      subjects: [Connection.key, Flow.key],
    },
    {
      label: 'Read',
      key: 'read',
      subjects: [Connection.key, Execution.key, Flow.key],
    },
  ],
  subjects: [Connection, Flow, Execution],
};

export default permissionCatalog;
