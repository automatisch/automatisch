import './check-env-file.js';
import { createDatabaseAndUser } from '../../bin/database/utils.js';
import { client as knex } from '../../src/config/database.js';
import logger from '../../src/helpers/logger.js';
import appConfig from '../../src/config/app.js';

const createAndMigrateDatabase = async () => {
  if (!appConfig.CI) {
    await createDatabaseAndUser();
  }

  const migrator = knex.migrate;

  await migrator.latest();

  logger.info(`Completed database migrations for the test database.`);
};

createAndMigrateDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
