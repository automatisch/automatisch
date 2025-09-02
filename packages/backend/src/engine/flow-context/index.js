import Flow from '@/models/flow.js';

export default class FlowContext {
  constructor({ flowId, testRun = null }) {
    this.flowId = flowId;
    this.testRunOverride = testRun;
  }

  async build() {
    this.flow = await Flow.query().findById(this.flowId).throwIfNotFound();
    this.triggerStep = await this.flow.getTriggerStep();
    this.triggerConnection = await this.triggerStep.$relatedQuery('connection');
    this.triggerApp = await this.triggerStep.getApp();
    this.triggerCommand = await this.triggerStep.getTriggerCommand();
    this.isTriggerBuiltInApp =
      this.triggerApp.key === 'webhook' || this.triggerApp.key === 'forms';
    // Use testRun parameter if provided, otherwise determine from flow.active
    this.testRun =
      this.testRunOverride !== null ? this.testRunOverride : !this.flow.active;

    this.user = await this.flow.$relatedQuery('user');

    return this;
  }
}
