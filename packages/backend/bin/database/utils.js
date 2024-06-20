import appConfig from '../../src/config/app.js';
import logger from '../../src/helpers/logger.js';
import client from './client.js';
import User from '../../src/models/user.js';
import Config from '../../src/models/config.js';
import Role from '../../src/models/role.js';
import '../../src/config/orm.js';
import process from 'process';

async function fetchAdminRole() {
  const role = await Role.query()
    .where({
      key: 'admin',
    })
    .limit(1)
    .first();

  return role;
}

export async function createUser(
  email = 'user@automatisch.io',
  password = 'sample'
) {
  if (appConfig.disableSeedUser) {
    logger.info('Seed user is disabled.');

    process.exit(0);

    return;
  }

  const UNIQUE_VIOLATION_CODE = '23505';

  const role = await fetchAdminRole();
  const userParams = {
    email,
    password,
    fullName: 'Initial admin',
    roleId: role.id,
  };

  try {
    const userCount = await User.query().resultSize();

    if (userCount === 0) {
      const user = await User.query().insertAndFetch(userParams);
      logger.info(`User has been saved: ${user.email}`);

      await Config.markInstallationCompleted();
    } else {
      logger.info('No need to seed a user.');
    }
  } catch (err) {
    if (err.nativeError.code !== UNIQUE_VIOLATION_CODE) {
      throw err;
    }

    logger.info(`User already exists: ${email}`);
  }

  process.exit(0);
}

export const createDatabaseAndUser = async (
  database = appConfig.postgresDatabase,
  user = appConfig.postgresUsername
) => {
  await client.connect();
  await createDatabase(database);
  await createDatabaseUser(user);
  await grantPrivileges(database, user);

  await client.end();
  process.exit(0);
};

export const createDatabase = async (database = appConfig.postgresDatabase) => {
  const DUPLICATE_DB_CODE = '42P04';

  try {
    await client.query(`CREATE DATABASE ${database}`);
    logger.info(`Database: ${database} created!`);
  } catch (err) {
    if (err.code !== DUPLICATE_DB_CODE) {
      throw err;
    }

    logger.info(`Database: ${database} already exists!`);
  }
};

export const createDatabaseUser = async (user = appConfig.postgresUsername) => {
  const DUPLICATE_OBJECT_CODE = '42710';

  try {
    const result = await client.query(`CREATE USER ${user}`);
    logger.info(`Database User: ${user} created!`);

    return result;
  } catch (err) {
    if (err.code !== DUPLICATE_OBJECT_CODE) {
      throw err;
    }

    logger.info(`Database User: ${user} already exists!`);
  }
};

export const grantPrivileges = async (
  database = appConfig.postgresDatabase,
  user = appConfig.postgresUsername
) => {
  await client.query(
    `GRANT ALL PRIVILEGES ON DATABASE ${database} TO ${user};`
  );

  logger.info(`${user} has granted all privileges on ${database}!`);
};

export const dropDatabase = async () => {
  if (appConfig.appEnv != 'development' && appConfig.appEnv != 'test') {
    const errorMessage =
      'Drop database command can be used only with development or test environments!';

    logger.error(errorMessage);
    return;
  }

  await client.connect();
  await dropDatabaseAndUser();

  await client.end();
};

export const dropDatabaseAndUser = async (
  database = appConfig.postgresDatabase,
  user = appConfig.postgresUsername
) => {
  await client.query(`DROP DATABASE IF EXISTS ${database}`);
  logger.info(`Database: ${database} removed!`);

  await client.query(`DROP USER IF EXISTS ${user}`);
  logger.info(`Database User: ${user} removed!`);
};
