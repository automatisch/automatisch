export default async (request, response) => {
  await request.currentUser.softRemove();

  response.status(204).end();
};
