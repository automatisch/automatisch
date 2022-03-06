import Context from '../../types/express/context';
import { IJSONObject } from '@automatisch/types';

type Params = {
  id: string;
  formattedData: IJSONObject;
};

const updateConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  let connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.id,
    })
    .throwIfNotFound();

  connection = await connection.$query().patchAndFetch({
    formattedData: {
      ...connection.formattedData,
      ...params.formattedData,
    },
  });

  return connection;
};

export default updateConnection;
