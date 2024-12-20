import { generateWorker } from './worker.js';
import { deleteUserJob } from '../jobs/delete-user.ee.js';

const deleteUserWorker = generateWorker('delete-user', deleteUserJob);

export default deleteUserWorker;
