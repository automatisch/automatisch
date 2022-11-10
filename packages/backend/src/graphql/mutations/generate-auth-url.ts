import Context from '../../types/express/context';
import axios from 'axios';
import globalVariable from '../../helpers/global-variable';
import App from '../../models/app';
import GenerateAuthUrlError from '../../errors/generate-auth-url';

type Params = {
  input: {
    id: string;
  };
};

const generateAuthUrl = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const connection = await context.currentUser
    .$relatedQuery('connections')
    .findOne({
      id: params.input.id,
    })
    .throwIfNotFound();

  if (!connection.formattedData) {
    return null;
  }

  const authInstance = (await import(`../../apps/${connection.key}/auth`))
    .default;
  const app = await App.findOneByKey(connection.key);

  const $ = await globalVariable({ connection, app });
  try {
    await authInstance.generateAuthUrl($);
    await axios.get(connection.formattedData.url as string);
  } catch (error) {
    throw new GenerateAuthUrlError(error);
  }

  return connection.formattedData;
};

export default generateAuthUrl;
