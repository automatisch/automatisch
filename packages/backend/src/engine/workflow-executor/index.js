import ExecutionPlan from '@/engine/execution-plan/index.js';
import StepExecutor from '@/engine/step-executor/index.js';

class WorkflowExecutor {
  constructor({ flowContext, initialDataItem, triggeredByRequest }) {
    this.flowContext = flowContext;
    this.triggerStep = flowContext.triggerStep;
    this.actionSteps = flowContext.actionSteps;
    this.initialDataItem = initialDataItem;
    this.triggeredByRequest = triggeredByRequest;

    this.initializeExecutionPlan();
  }

  initializeExecutionPlan() {
    this.executionPlan = new ExecutionPlan(this.triggerStep, this.actionSteps);
    // TODO: Handle resume case for the execution plan
    // this.executionPlan.initializeResume(
    //   this.resumeStepId,
    //   this.resumeExecutionId
    // );
  }

  async run() {
    while (this.shouldContinueExecution()) {
      const result = await this.processNextStep();

      if (this.shouldExitEarly(result)) {
        return this.getExitResponse(result);
      }

      if (this.shouldBreakLoop(result)) {
        break;
      }
    }

    return this.getFinalResponse();
  }

  shouldContinueExecution() {
    return this.executionPlan.hasMoreSteps();
  }

  async processNextStep() {
    const currentStep = this.getNextStep();

    if (!currentStep) {
      return this.createBreakSignal();
    }

    return await this.executeStep(currentStep);
  }

  getNextStep() {
    return this.executionPlan.getNextStep();
  }

  createBreakSignal() {
    return { shouldBreak: true };
  }

  async executeStep(step) {
    this.stepExecutor = new StepExecutor({
      flow: this.flow,
      step,
      executionId: this.executionId,
    });

    const result = await this.stepExecutor.processStep();

    this.updateExecutionId(result);

    return result;
  }

  updateExecutionId(result) {
    if (result.executionId) this.executionId = result.executionId;
  }

  shouldExitEarly(result) {
    return result.shouldExit === true;
  }

  getExitResponse(result) {
    return result.exitResponse;
  }

  shouldBreakLoop(result) {
    return result.shouldBreak === true;
  }

  getFinalResponse() {
    if (this.isTriggeredRequest()) {
      return this.createNoContentResponse();
    }
    return this.createEmptyResponse();
  }

  isTriggeredRequest() {
    return this.executionContext.isTriggeredByRequest();
  }

  createNoContentResponse() {
    return { statusCode: 204 };
  }

  createEmptyResponse() {
    return undefined;
  }
}

export default WorkflowExecutor;
