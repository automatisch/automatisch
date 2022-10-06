import Context from '../../types/express/context';
import App from '../../models/app';
import globalVariable from '../../helpers/global-variable';

type Params = {
  input: {
    id: string;
  };
};

const verifyConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  const app = await App.findOneByKey(connection.key);
  const authInstance = (await import(`../../apps/${connection.key}2/auth`))
    .default;

  const $ = globalVariable(connection, app);
  await authInstance.verifyCredentials($);

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
