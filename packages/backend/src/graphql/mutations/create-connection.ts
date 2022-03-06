import App from '../../models/app';
import Context from '../../types/express/context';
import { IJSONObject } from '@automatisch/types';

type Params = {
  key: string;
  formattedData: IJSONObject;
};
const createConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const app = App.findOneByKey(params.key);

  const connection = await context.currentUser
    .$relatedQuery('connections')
    .insert({
      key: params.key,
      formattedData: params.formattedData,
    });

  return {
    ...connection,
    app,
  };
};

export default createConnection;
