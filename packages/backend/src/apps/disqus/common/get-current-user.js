const getCurrentUser = async ($) => {
  try {
    const { data: currentUser } = await $.http.get('/3.0/users/details.json');
    return currentUser;
  } catch (error) {
    throw new Error('You are not authenticated.');
  }
};

export default getCurrentUser;
