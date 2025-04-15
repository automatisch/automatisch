const getPermissionsCatalogMock = async () => {
  const data = {
    actions: [
      {
        key: 'read',
        label: 'Read',
        subjects: ['Connection', 'Execution', 'Flow'],
      },
      {
        key: 'manage',
        label: 'Manage',
        subjects: ['Connection', 'Flow'],
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
