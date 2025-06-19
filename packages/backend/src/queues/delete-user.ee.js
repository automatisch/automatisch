import { generateQueue } from '@/queues/queue.js';

const deleteUserQueue = generateQueue('delete-user');
export default deleteUserQueue;
