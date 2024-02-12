import appConfig from '../../../../config/app';

export default async (request, response) => {
  response.json({ version: appConfig.version });
};
