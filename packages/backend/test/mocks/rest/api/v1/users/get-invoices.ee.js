const getInvoicesMock = async (invoices) => {
  return {
    data: invoices,
    meta: {
      count: invoices.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getInvoicesMock;
