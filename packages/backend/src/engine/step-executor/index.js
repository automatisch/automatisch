import TriggerExecutor from '@/engine/executors/trigger-executor.js';
import ActionExecutor from '@/engine/executors/action-executor.js';
import FilterExecutor from '@/engine/executors/filter-executor.js';
import DelayExecutor from '@/engine/executors/delay-executor.js';
import RespondExecutor from '@/engine/executors/respond-executor.js';

class StepExecutor {
  constructor(flow, executionId) {
    this.flow = flow;
    this.executionId = executionId;
    this.triggerStep = null;

    // Executor'ları başlat
    this.triggerExecutor = new TriggerExecutor();
    this.actionExecutor = new ActionExecutor();
    this.filterExecutor = new FilterExecutor();
    this.delayExecutor = new DelayExecutor();
    this.respondExecutor = new RespondExecutor();
  }

  // Set trigger step for reference
  setTriggerStep(triggerStep) {
    this.triggerStep = triggerStep;
  }

  // ExecutionId'yi güncelle
  updateExecutionId(newExecutionId) {
    this.executionId = newExecutionId;
  }

  // Step trigger mı kontrol et
  isTriggerStep(step) {
    return step.isTrigger === true;
  }

  // Ana step işleme metodu
  async processStep(step, context, executionPlan) {
    // Context'e flow ekle (TriggerExecutor için)
    context.flow = this.flow;
    context.executionId = this.executionId;

    // Trigger step
    if (this.isTriggerStep(step)) {
      const result = await this.triggerExecutor.execute(
        step,
        context,
        executionPlan
      );

      // ExecutionId güncelle
      if (result.executionId) {
        this.updateExecutionId(result.executionId);
      }

      return result;
    }

    // Action step
    const actionResult = await this.actionExecutor.execute(
      step,
      context,
      executionPlan,
      this.flow
    );

    // Early exit durumları
    if (actionResult.shouldExit || !actionResult.shouldContinue) {
      return actionResult;
    }

    const { executionStep, computedParameters } = actionResult;

    // Filter kontrolü
    const filterResult = await this.filterExecutor.execute(
      step,
      executionStep,
      context
    );
    if (filterResult.shouldExit || filterResult.shouldBreak) {
      return filterResult;
    }

    // Delay kontrolü
    const delayResult = await this.delayExecutor.execute(
      step,
      computedParameters,
      context,
      this.flow,
      this.triggerStep
    );
    if (delayResult.shouldExit) {
      return delayResult;
    }

    // Respond kontrolü
    const respondResult = await this.respondExecutor.execute(
      step,
      executionStep,
      context
    );
    if (respondResult.shouldExit) {
      return respondResult;
    }

    return { shouldContinue: true };
  }
}

export default StepExecutor;
