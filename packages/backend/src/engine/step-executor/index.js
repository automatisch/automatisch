import TriggerExecutor from '@/engine/executors/trigger-executor.js';
import ActionExecutor from '@/engine/executors/action-executor.js';
// import FilterExecutor from '@/engine/executors/filter-executor.js';
// import DelayExecutor from '@/engine/executors/delay-executor.js';
// import RespondExecutor from '@/engine/executors/respond-executor.js';

class StepExecutor {
  constructor({ flow, step, executionId }) {
    this.flow = flow;
    this.step = step;
    this.executionId = executionId;

    this.executor = this.assignExecutor();
  }

  assignExecutor() {
    if (this.step.isTrigger) {
      return new TriggerExecutor();
    } else if (this.step.isAction) {
      return new ActionExecutor();
    }

    // } else if (this.step.isFilter) {
    //   return new FilterExecutor();
    // } else if (this.step.isDelay) {
    //   return new DelayExecutor();
    // } else if (this.step.isRespond) {
    //   return new RespondExecutor();
    // }

    throw new Error('Invalid step type');
  }

  // Ana step işleme metodu
  async processStep() {
    const result = await this.executor.execute({ step: this.step });

    // // Trigger step
    // if (this.isTriggerStep(step)) {
    //   const result = await this.triggerExecutor.execute(
    //     step,
    //     context,
    //     executionPlan
    //   );
    //   // ExecutionId güncelle
    //   if (result.executionId) {
    //     this.updateExecutionId(result.executionId);
    //   }
    //   return result;
    // }
    // // Action step
    // const actionResult = await this.actionExecutor.execute(
    //   step,
    //   context,
    //   executionPlan,
    //   this.flow
    // );
    // // Early exit durumları
    // if (actionResult.shouldExit || !actionResult.shouldContinue) {
    //   return actionResult;
    // }
    // const { executionStep, computedParameters } = actionResult;
    // // Filter kontrolü
    // const filterResult = await this.filterExecutor.execute(
    //   step,
    //   executionStep,
    //   context
    // );
    // if (filterResult.shouldExit || filterResult.shouldBreak) {
    //   return filterResult;
    // }
    // // Delay kontrolü
    // const delayResult = await this.delayExecutor.execute(
    //   step,
    //   computedParameters,
    //   context,
    //   this.flow,
    //   this.triggerStep
    // );
    // if (delayResult.shouldExit) {
    //   return delayResult;
    // }
    // // Respond kontrolü
    // const respondResult = await this.respondExecutor.execute(
    //   step,
    //   executionStep,
    //   context
    // );
    // if (respondResult.shouldExit) {
    //   return respondResult;
    // }
    // return { shouldContinue: true };
  }
}

export default StepExecutor;
