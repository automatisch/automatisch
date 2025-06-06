import { generateWorker } from '@/workers/worker.js';
import { executeFlowJob } from '@/jobs/execute-flow.js';

const flowWorker = generateWorker('flow', executeFlowJob);

export default flowWorker;
