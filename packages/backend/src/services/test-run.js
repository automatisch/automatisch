import Engine from '@/engine/index.js';

const testRun = async (options) => {
  return await Engine.run({ untilStepId: options.stepId, testRun: true });
};

export default testRun;
