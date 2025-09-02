import processTriggerStep from '@/engine/trigger/process.js';

class TriggerExecutor {
  async execute(step, context, executionPlan) {
    const result = await this.runTrigger(step, context);
    const { executionId: newExecutionId, executionStep } = result;

    this.updateState(
      newExecutionId,
      executionStep,
      step,
      context,
      executionPlan
    );

    const exitResponse = this.checkEarlyExit(step, executionStep, context);
    if (exitResponse) {
      return { ...exitResponse, executionId: newExecutionId };
    }

    return this.createSuccessResponse(newExecutionId);
  }

  async runTrigger(step, context) {
    return await processTriggerStep({
      flowId: context.flow.id,
      stepId: step.id,
      initialDataItem: context.initialDataItem,
      testRun: context.isTestRun(),
    });
  }

  updateState(executionId, executionStep, step, context, executionPlan) {
    if (executionId) {
      context.updateExecutionId(executionId);
    }
    executionPlan.markStepAsCompleted(step);
    context.addStepResult(step.id, executionStep);
  }

  checkEarlyExit(step, executionStep, context) {
    // Test stop kontrolü
    if (context.shouldStopAtStep(step.id)) {
      return this.createStopResponse(executionStep);
    }

    // Test request kontrolü
    if (this.isTestWithRequest(context)) {
      return this.createTestRequestResponse();
    }

    return null;
  }

  isTestWithRequest(context) {
    return context.isTestRun() && context.isTriggeredByRequest();
  }

  createStopResponse(executionStep) {
    return {
      shouldExit: true,
      exitResponse: { executionStep },
    };
  }

  createTestRequestResponse() {
    return {
      shouldExit: true,
      exitResponse: { statusCode: 204 },
    };
  }

  createSuccessResponse(executionId) {
    return {
      shouldContinue: true,
      executionId,
    };
  }
}

export default TriggerExecutor;
