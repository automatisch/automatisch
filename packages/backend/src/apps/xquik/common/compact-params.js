const compactParams = (params) => {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => {
      return value !== undefined && value !== null && value !== '';
    })
  );
};

export default compactParams;
