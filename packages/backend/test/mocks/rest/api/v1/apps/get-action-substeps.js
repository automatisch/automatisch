const getActionSubstepsMock = (substeps) => {
  return {
    data: substeps,
    meta: {
      count: substeps.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getActionSubstepsMock;
