const getPreviousStepsMock = async (steps, executionSteps) => {
  const data = steps.map((step) => {
    const filteredExecutionSteps = executionSteps.filter(
      (executionStep) => executionStep.stepId === step.id
    );

    return {
      id: step.id,
      type: step.type,
      key: step.key,
      appKey: step.appKey,
      iconUrl: step.iconUrl,
      webhookUrl: step.webhookUrl,
      status: step.status,
      position: step.position,
      parameters: step.parameters,
      executionSteps: filteredExecutionSteps.map((executionStep) => ({
        id: executionStep.id,
        dataIn: executionStep.dataIn,
        dataOut: executionStep.dataOut,
        errorDetails: executionStep.errorDetails,
        status: executionStep.status,
        createdAt: executionStep.createdAt.getTime(),
        updatedAt: executionStep.updatedAt.getTime(),
      })),
    };
  });

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Step',
    },
  };
};

export default getPreviousStepsMock;
