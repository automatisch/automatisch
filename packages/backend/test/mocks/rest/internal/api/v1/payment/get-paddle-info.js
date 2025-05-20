const getPaddleInfoMock = async () => {
  return {
    data: {
      sandbox: true,
      vendorId: 'sampleVendorId',
    },
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getPaddleInfoMock;
