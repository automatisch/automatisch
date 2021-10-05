import appConfig from '../../src/config/app';
import logger from '../../src/helpers/logger';
import client from './client';

const dropDatabase = async () => {
  if (appConfig.appEnv != 'development' && appConfig.appEnv != 'test') {
    const errorMessage = 'Drop database command can be used only with development or test environments!'

    logger.error(errorMessage)
    return;
  }

  await client.connect();
  await dropDatabaseAndUser();

  await client.end();
}

const dropDatabaseAndUser = async() => {
  await client.query(`DROP DATABASE IF EXISTS ${appConfig.postgresDatabase}`);
  logger.info(`Database: ${appConfig.postgresDatabase} removed!`);

  await client.query(`DROP USER IF EXISTS ${appConfig.postgresUsername}`);
  logger.info(`Database User: ${appConfig.postgresUsername} removed!`);
}



dropDatabase();
