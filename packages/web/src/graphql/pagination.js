const makeEmptyData = () => {
  return {
    edges: [],
    pageInfo: {
      currentPage: 1,
      totalPages: 1,
    },
  };
};
function offsetLimitPagination(keyArgs = false) {
  return {
    keyArgs,
    merge(existing, incoming, { args }) {
      if (!existing) {
        existing = makeEmptyData();
      }
      if (!incoming || incoming === null) return existing;
      const existingEdges = existing?.edges || [];
      const incomingEdges = incoming.edges || [];
      if (args) {
        const newEdges = [...existingEdges, ...incomingEdges];
        return {
          pageInfo: incoming.pageInfo,
          edges: newEdges,
        };
      } else {
        return existing;
      }
    },
  };
}
export default offsetLimitPagination;
