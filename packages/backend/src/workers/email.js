import { generateWorker } from './worker.js';
import { sendEmailJob } from '../jobs/send-email.js';

const emailWorker = generateWorker('email', sendEmailJob);

export default emailWorker;
