import appConfig from '../../src/config/app.js';
import logger from '../../src/helpers/logger.js';
import '../../src/config/orm.js';
import { client as knex } from '../../src/config/database.js';

export const renameMigrationsAsJsFiles = async () => {
  if (!appConfig.isDev) {
    return;
  }

  try {
    const tableExists = await knex.schema.hasTable('knex_migrations');

    if (tableExists) {
      await knex('knex_migrations')
        .where('name', 'like', '%.ts')
        .update({
          name: knex.raw("REPLACE(name, '.ts', '.js')"),
        });
      logger.info(
        `Migration file names with typescript renamed as JS file names!`
      );
    }
  } catch (err) {
    logger.error(err.message);
  }

  await knex.destroy();
};

renameMigrationsAsJsFiles();
