const getExecutionStepsMock = async (executionSteps, steps) => {
  const data = executionSteps.map((executionStep) => {
    const step = steps.find((step) => step.id === executionStep.stepId);

    return {
      id: executionStep.id,
      dataIn: executionStep.dataIn,
      dataOut: executionStep.dataOut,
      errorDetails: executionStep.errorDetails,
      status: executionStep.status,
      createdAt: executionStep.createdAt.getTime(),
      updatedAt: executionStep.updatedAt.getTime(),
      step: {
        id: step.id,
        type: step.type,
        key: step.key,
        appKey: step.appKey,
        iconUrl: step.iconUrl,
        webhookUrl: step.webhookUrl,
        status: step.status,
        position: step.position,
        parameters: step.parameters,
      },
    };
  });

  return {
    data: data,
    meta: {
      count: executionSteps.length,
      currentPage: 1,
      isArray: true,
      totalPages: 1,
      type: 'ExecutionStep',
    },
  };
};

export default getExecutionStepsMock;
