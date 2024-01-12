import appConfig from '../../src/config/app.js';
import logger from '../../src/helpers/logger.js';
import '../../src/config/orm.js';
import { client as knex } from '../../src/config/database.js';

export const renameMigrationsAsJsFiles = async () => {
  if (!appConfig.isDev) {
    return;
  }

  try {
    await knex.raw(
      `UPDATE knex_migrations SET name = REPLACE(name, '.ts', '.js') WHERE name LIKE '%.ts';`
    );

    logger.info(
      `Migration file names with typescript renamed as JS file names!`
    );
  } catch (err) {
    logger.error(err.message);
  }

  await knex.destroy();
};

renameMigrationsAsJsFiles();
