import { createDatabaseAndUser } from '../../bin/database/utils';
import logger from '../../src/helpers/logger';

createDatabaseAndUser()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    logger.error(error);
    process.exit(1);
  });
