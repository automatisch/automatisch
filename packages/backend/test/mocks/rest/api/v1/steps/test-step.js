const testStepMock = async (step, lastExecutionStep) => {
  const data = {
    id: step.id,
    appKey: step.appKey,
    key: step.key,
    iconUrl: step.iconUrl,
    lastExecutionStep: {
      id: lastExecutionStep.id,
      status: lastExecutionStep.status,
      dataIn: lastExecutionStep.dataIn,
      dataOut: lastExecutionStep.dataOut,
      errorDetails: lastExecutionStep.errorDetails,
      createdAt: lastExecutionStep.createdAt.getTime(),
      updatedAt: lastExecutionStep.updatedAt.getTime(),
    },
    parameters: step.parameters,
    position: step.position,
    status: step.status,
    type: step.type,
  };

  return {
    data: data,
    meta: {
      count: 1,
      currentPage: null,
      isArray: false,
      totalPages: null,
      type: 'Step',
    },
  };
};

export default testStepMock;
