import { generateWorker } from './worker.js';
import { executeTriggerJob } from '../jobs/execute-trigger.js';

const triggerWorker = generateWorker('flow', executeTriggerJob);

export default triggerWorker;
