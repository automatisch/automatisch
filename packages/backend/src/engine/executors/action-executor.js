import processActionStep from '@/engine/action/process.js';

class ActionExecutor {
  async execute(step, context, executionPlan, flow) {
    const result = await this.runAction(step, flow, context);
    const { executionStep, computedParameters } = result;

    this.updateState(step, executionStep, context, executionPlan);

    const exitResponse = this.checkExitConditions(step, executionStep, context);
    if (exitResponse) {
      return exitResponse;
    }

    return this.createSuccessResponse(executionStep, computedParameters);
  }

  async runAction(step, flow, context) {
    return await processActionStep({
      flow,
      stepId: step.id,
      executionId: context.executionId,
    });
  }

  updateState(step, executionStep, context, executionPlan) {
    executionPlan.markStepAsCompleted(step);
    context.addStepResult(step.id, executionStep);
  }

  checkExitConditions(step, executionStep, context) {
    // Stop at step kontrolü
    if (this.shouldStop(step, executionStep, context)) {
      return this.createStopResponse(executionStep);
    }

    // Production'da hata kontrolü
    if (this.shouldContinueOnFailure(executionStep, context)) {
      return this.createContinueResponse();
    }

    return null;
  }

  shouldStop(step, executionStep, context) {
    return (
      context.shouldStopAtStep(step.id) ||
      (context.isTestRun() && executionStep.isFailed)
    );
  }

  shouldContinueOnFailure(executionStep, context) {
    return !context.isTestRun() && executionStep.isFailed;
  }

  createStopResponse(executionStep) {
    return {
      shouldExit: true,
      exitResponse: { executionStep },
    };
  }

  createContinueResponse() {
    return { shouldContinue: true };
  }

  createSuccessResponse(executionStep, computedParameters) {
    return {
      shouldContinue: true,
      executionStep,
      computedParameters,
    };
  }
}

export default ActionExecutor;
