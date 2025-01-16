import { generateWorker } from './worker.js';
import { executeTriggerJob } from '../jobs/execute-trigger.js';

const triggerWorker = generateWorker('trigger', executeTriggerJob);

export default triggerWorker;
