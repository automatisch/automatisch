import logger from '../../../helpers/logger.js';
import getClient from '../common/postgres-client.js';

const verifyCredentials = async ($) => {
  const client = getClient($);
  const checkConnection = await client.raw('SELECT 1');
  client.destroy();

  logger.debug(checkConnection);

  await $.auth.set({
    screenName: `${$.auth.data.user}@${$.auth.data.host}:${$.auth.data.port}/${$.auth.data.database}`,
    client: 'pg',
    version: $.auth.data.version,
    host: $.auth.data.host,
    port: Number($.auth.data.port),
    enableSsl:
      $.auth.data.enableSsl === 'true' || $.auth.data.enableSsl === true,
    user: $.auth.data.user,
    password: $.auth.data.password,
    database: $.auth.data.database,
  });
};

export default verifyCredentials;
