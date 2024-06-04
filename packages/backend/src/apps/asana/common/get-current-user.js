const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get(
    `/1.0/users/${$.auth.data.gid}`
  );
  return currentUser;
};

export default getCurrentUser;
