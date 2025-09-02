class FilterExecutor {
  async execute(step, executionStep, context) {
    if (!this.isFilterStep(step)) {
      return this.createContinueResponse();
    }

    if (!this.hasFilterFailed(executionStep)) {
      return this.createContinueResponse();
    }

    return this.handleFilterFailure(context);
  }

  isFilterStep(step) {
    return step.appKey === 'filter';
  }

  hasFilterFailed(executionStep) {
    return !executionStep.dataOut;
  }

  handleFilterFailure(context) {
    if (context.isTriggeredByRequest()) {
      return this.createFilterErrorResponse();
    }
    return this.createBreakResponse();
  }

  createContinueResponse() {
    return { shouldContinue: true };
  }

  createFilterErrorResponse() {
    return {
      shouldExit: true,
      exitResponse: { statusCode: 422 },
    };
  }

  createBreakResponse() {
    return { shouldBreak: true };
  }
}

export default FilterExecutor;
