import Context from '../../types/express/context';
import { IJSONObject } from '@automatisch/types';

type Params = {
  input: {
    id: string;
    formattedData: IJSONObject;
  };
};

const updateConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  context.currentUser.can('create', 'Connection');

  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  connection = await connection.$query().patchAndFetch({
    formattedData: {
      ...connection.formattedData,
      ...params.input.formattedData,
    },
  });

  return connection;
};

export default updateConnection;
