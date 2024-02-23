const getPermissionsCatalogMock = async () => {
  const data = {
    actions: [
      {
        key: 'create',
        label: 'Create',
        subjects: ['Connection', 'Flow'],
      },
      {
        key: 'read',
        label: 'Read',
        subjects: ['Connection', 'Execution', 'Flow'],
      },
      {
        key: 'update',
        label: 'Update',
        subjects: ['Connection', 'Flow'],
      },
      {
        key: 'delete',
        label: 'Delete',
        subjects: ['Connection', 'Flow'],
      },
      {
        key: 'publish',
        label: 'Publish',
        subjects: ['Flow'],
      },
    ],
    conditions: [
      {
        key: 'isCreator',
        label: 'Is creator',
      },
    ],
    subjects: [
      {
        key: 'Connection',
        label: 'Connection',
      },
      {
        key: 'Flow',
        label: 'Flow',
      },
      {
        key: 'Execution',
        label: 'Execution',
      },
    ],
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getPermissionsCatalogMock;
