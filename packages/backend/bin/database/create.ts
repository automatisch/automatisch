import appConfig from '../../src/config/app';
import logger from '../../src/helpers/logger';
import client from './client';

const createDatabaseAndUser = async () => {
  if(appConfig.appEnv !== 'development' && appConfig.appEnv !== 'test') {
    const errorMessage = 'Database creation can be used only with development or test environments!'
    logger.error(errorMessage)

    return;
  }

  await client.connect();
  await createDatabase();
  await createDatabaseUser();
  await grantPrivileges();

  await client.end();
}

const createDatabase = async () => {
  await client.query(`CREATE DATABASE ${appConfig.postgresDatabase}`);
  logger.info(`Database: ${appConfig.postgresDatabase} created!`);
}

const createDatabaseUser = async () => {
  await client.query(`CREATE USER ${appConfig.postgresUsername}`);
  logger.info(`Database User: ${appConfig.postgresUsername} created!`);
}

const grantPrivileges = async () => {
  await client.query(
    `GRANT ALL PRIVILEGES ON DATABASE ${appConfig.postgresDatabase} TO ${appConfig.postgresUsername};`
  );

  logger.info(
    `${appConfig.postgresUsername} has granted all privileges on ${appConfig.postgresDatabase}!`
  );

}

createDatabaseAndUser();
