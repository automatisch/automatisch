const adminApiTokenFullSerializer = (apiToken) => {
  return {
    id: apiToken.id,
    token: apiToken.token,
    createdAt: apiToken.createdAt.getTime(),
    updatedAt: apiToken.updatedAt.getTime(),
  };
};

export default adminApiTokenFullSerializer;
