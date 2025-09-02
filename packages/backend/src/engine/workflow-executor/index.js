import ExecutionPlan from '@/engine/execution-plan/index.js';
import ExecutionContext from '@/engine/execution-context/index.js';
import StepExecutor from '@/engine/step-executor/index.js';

/**
 * WorkflowExecutor - Main orchestrator for workflow execution
 * Coordinates ExecutionPlan, ExecutionContext, and StepExecutor
 */
class WorkflowExecutor {
  constructor(config) {
    this.validateConfig(config);
    this.initializeFromConfig(config);
    this.initializeExecutionState();
  }

  validateConfig(config) {
    if (!config.flow) {
      throw new Error('Flow is required for WorkflowExecutor');
    }
    if (!config.triggerStep) {
      throw new Error('TriggerStep is required for WorkflowExecutor');
    }
  }

  initializeFromConfig(config) {
    // Required fields
    this.flow = config.flow;
    this.triggerStep = config.triggerStep;
    this.actionSteps = config.actionSteps || [];

    // Optional fields
    this.untilStep = config.untilStep;
    this.testRun = config.testRun || false;
    this.triggeredByRequest = config.triggeredByRequest || false;
    this.initialDataItem = config.initialDataItem;

    // Resume fields
    this.resumeStepId = config.resumeStepId;
    this.resumeExecutionId = config.resumeExecutionId;
  }

  initializeExecutionState() {
    this.executionId = this.resumeExecutionId || null;
    this.executionPlan = null;
    this.executionContext = null;
    this.stepExecutor = null;
  }

  async execute() {
    this.initialize();
    return await this.runWorkflow();
  }

  initialize() {
    this.initializeExecutionPlan();
    this.initializeExecutionContext();
    this.initializeStepExecutor();
  }

  initializeExecutionPlan() {
    this.executionPlan = new ExecutionPlan(this.triggerStep, this.actionSteps);
    this.executionPlan.initializeResume(
      this.resumeStepId,
      this.resumeExecutionId
    );
  }

  initializeExecutionContext() {
    this.executionContext = new ExecutionContext(
      this.flow,
      this.executionId,
      this.testRun
    );
    this.executionContext.setResumeInfo(
      this.resumeStepId,
      this.resumeExecutionId
    );
    this.executionContext.setInitialData(
      this.initialDataItem,
      this.triggeredByRequest,
      this.untilStep
    );
  }

  initializeStepExecutor() {
    this.stepExecutor = new StepExecutor(this.flow, this.executionId);
    this.stepExecutor.setTriggerStep(this.triggerStep);
  }

  async runWorkflow() {
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
    const result = await this.stepExecutor.processStep(
      step,
      this.executionContext,
      this.executionPlan
    );

    this.handleExecutionIdUpdate(result);

    return result;
  }

  handleExecutionIdUpdate(result) {
    if (result.executionId) {
      this.updateExecutionId(result.executionId);
    }
  }

  updateExecutionId(newExecutionId) {
    this.executionId = newExecutionId;
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

  // Static factory method for backward compatibility
  static async run(config) {
    const executor = new WorkflowExecutor(config);
    return await executor.execute();
  }
}

export default WorkflowExecutor;
