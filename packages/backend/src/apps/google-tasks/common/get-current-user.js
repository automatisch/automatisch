const getCurrentUser = async ($) => {
  const { data: currentUser } = await $.http.get(
    'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses'
  );
  return currentUser;
};

export default getCurrentUser;
