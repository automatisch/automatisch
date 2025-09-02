import Engine from '@/engine/index.js';
import delayAsMilliseconds from '@/helpers/delay-as-milliseconds.js';

class DelayExecutor {
  async execute(step, computedParameters, context, flow, triggerStep) {
    if (!this.isDelayStep(step)) {
      return this.createContinueResponse();
    }

    if (this.shouldSkipDelay(context, triggerStep)) {
      return this.createContinueResponse();
    }

    return await this.handleDelay(step, computedParameters, context, flow);
  }

  isDelayStep(step) {
    return step.appKey === 'delay';
  }

  shouldSkipDelay(context, triggerStep) {
    return (
      this.isTestMode(context) || this.shouldWorkSynchronously(triggerStep)
    );
  }

  isTestMode(context) {
    return context.isTestRun();
  }

  shouldWorkSynchronously(triggerStep) {
    return (
      this.isSynchronousTrigger(triggerStep) &&
      this.hasSynchronousFlag(triggerStep)
    );
  }

  isSynchronousTrigger(triggerStep) {
    return triggerStep?.appKey === 'webhook' || triggerStep?.appKey === 'forms';
  }

  hasSynchronousFlag(triggerStep) {
    return triggerStep?.parameters?.workSynchronously;
  }

  async handleDelay(step, computedParameters, context, flow) {
    const nextStepId = await this.getNextStep(step);

    if (!nextStepId) {
      return this.createExitResponse();
    }

    await this.scheduleBackgroundJob(
      flow.id,
      nextStepId.id,
      context.executionId,
      this.calculateDelay(step.key, computedParameters)
    );

    return this.createExitResponse();
  }

  async getNextStep(step) {
    return await step.getNextStep();
  }

  calculateDelay(stepKey, computedParameters) {
    return delayAsMilliseconds(stepKey, computedParameters);
  }

  async scheduleBackgroundJob(flowId, resumeStepId, executionId, delay) {
    await Engine.runInBackground({
      flowId,
      resumeStepId,
      resumeExecutionId: executionId,
      delay,
    });
  }

  createContinueResponse() {
    return { shouldContinue: true };
  }

  createExitResponse() {
    return { shouldExit: true };
  }
}

export default DelayExecutor;
