import { IJSONObject } from '@automatisch/types';
import Context from '../../types/express/context';
import AppAuthClient from '../../models/app-auth-client';

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
  context.currentUser.can('create', 'Connection');

  let connection = await context.currentUser
    .$relatedQuery('connections')
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
