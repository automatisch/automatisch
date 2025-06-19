import { generateWorker } from '@/workers/worker.js';
import { deleteUserJob } from '@/jobs/delete-user.ee.js';

const deleteUserWorker = generateWorker('delete-user', deleteUserJob);

export default deleteUserWorker;
