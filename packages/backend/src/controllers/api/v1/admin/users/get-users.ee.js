import { renderObject } from '../../../../../helpers/renderer.js';
import User from '../../../../../models/user.js';
import paginateRest from '../../../../../helpers/pagination-rest.js';

export default async (request, response) => {
  const usersQuery = User.query()
    .withGraphFetched({
      role: true,
    })
    .orderBy('full_name', 'asc');

  const users = await paginateRest(usersQuery, request.query.page);

  renderObject(response, users);
};
