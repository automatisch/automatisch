import appConfig from '../../src/config/app';
import logger from '../../src/helpers/logger';
import client from './client';
import User from '../../src/models/user';
import Role from '../../src/models/role';
import '../../src/config/orm';

async function fetchAdminRole() {
  const role = await Role
    .query()
    .where({
      key: 'admin'
    })
    .limit(1)
    .first();

  return role;
}

export async function createUser(
  email = 'user@automatisch.io',
  password = 'sample'
) {
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
    } else {
      logger.info('No need to seed a user.');
    }
  } catch (err) {
    if ((err as any).nativeError.code !== UNIQUE_VIOLATION_CODE) {
      throw err;
    }

    logger.info(`User already exists: ${email}`);
  }
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
};

export const createDatabase = async (database = appConfig.postgresDatabase) => {
  const DUPLICATE_DB_CODE = '42P04';

  try {
    await client.query(`CREATE DATABASE ${database}`);
    logger.info(`Database: ${database} created!`);
  } catch (err) {
    if ((err as any).code !== DUPLICATE_DB_CODE) {
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
    if ((err as any).code !== DUPLICATE_OBJECT_CODE) {
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
