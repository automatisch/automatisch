const actionSerializer = (action) => {
  return {
    name: action.name,
    key: action.key,
    description: action.description,
  };
};

export default actionSerializer;
