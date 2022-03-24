import User from '../../src/models/user';
import '../../src/config/database';
import logger from '../../src/helpers/logger';

const userParams = {
  email: 'user@automatisch.io',
  password: 'sample',
};

async function createUser() {
  const user = await User.query().insertAndFetch(userParams);
  logger.info(`User has been saved: ${user.email}`);
}

createUser();
