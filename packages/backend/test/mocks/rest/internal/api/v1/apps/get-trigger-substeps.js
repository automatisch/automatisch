const getTriggerSubstepsMock = (substeps) => {
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

export default getTriggerSubstepsMock;
