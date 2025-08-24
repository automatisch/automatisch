const checkLimits = async ({ flow }) => {
  const user = await flow.$relatedQuery('user');
  const isAllowedToRunFlows = await user.isAllowedToRunFlows();

  return {
    isAllowedToRunFlows,
  };
};

export default checkLimits;
