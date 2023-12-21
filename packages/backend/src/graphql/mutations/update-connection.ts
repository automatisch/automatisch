import { IJSONObject } from '@automatisch/types';
import Context from '../../types/express/context';
import AppAuthClient from '../../models/app-auth-client';
import Connection from '../../models/connection';

type Params = {
  input: {
    id: string;
    formattedData?: IJSONObject;
    appAuthClientId?: string;
  };
};

const updateConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('update', 'Connection');
  const userConnections = context.currentUser.$relatedQuery('connections');
  const allConnections = Connection.query();
  const baseQuery = conditions.isCreator ? userConnections : allConnections;

  let connection = await baseQuery
    .clone()
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  let formattedData = params.input.formattedData;

  if (params.input.appAuthClientId) {
    const appAuthClient = await AppAuthClient
      .query()
      .findById(params.input.appAuthClientId)
      .throwIfNotFound();

    formattedData = appAuthClient.formattedAuthDefaults;
  }

  connection = await connection.$query().patchAndFetch({
    formattedData: {
      ...connection.formattedData,
      ...formattedData,
    },
  });

  return connection;
};

export default updateConnection;
