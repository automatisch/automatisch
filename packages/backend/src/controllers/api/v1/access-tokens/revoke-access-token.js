export default async (request, response) => {
  const token = request.params.token;

  const accessToken = await request.currentUser
    .$relatedQuery('accessTokens')
    .findOne({
      token,
      revoked_at: null,
    })
    .throwIfNotFound();

  await accessToken.revoke();

  response.status(204).send();
};
