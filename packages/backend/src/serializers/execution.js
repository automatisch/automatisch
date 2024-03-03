import flowSerializer from './flow.js';

const executionSerializer = (execution) => {
  let executionData = {
    id: execution.id,
    testRun: execution.testRun,
    createdAt: execution.createdAt.getTime(),
    updatedAt: execution.updatedAt.getTime(),
  };

  if (execution.flow) {
    executionData.flow = flowSerializer(execution.flow);
  }

  return executionData;
};

export default executionSerializer;
