const getCurrentUser = async ($) => {
  const handle = $.auth.data.handle;

  const params = {
    actor: handle,
  };

  const { data: currentUser } = await $.http.get('/app.bsky.actor.getProfile', {
    params,
  });

  return currentUser;
};

export default getCurrentUser;
