import App from '../../models/app.js';
import globalVariable from '../../helpers/global-variable.js';

const verifyConnection = async (_parent, params, context) => {
  context.currentUser.can('create', 'Connection');

  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  const app = await App.findOneByKey(connection.key);
  const $ = await globalVariable({ connection, app });
  await app.auth.verifyCredentials($);

  connection = await connection.$query().patchAndFetch({
    verified: true,
    draft: false,
  });

  return {
    ...connection,
    app,
  };
};

export default verifyConnection;
