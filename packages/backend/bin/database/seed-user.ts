import { createUser } from './utils';

(async () => {
  await createUser();
  process.exit();
})();
