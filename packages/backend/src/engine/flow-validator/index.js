class FlowValidator {
  constructor(flowContext) {
    this.flowContext = flowContext;
  }

  async run() {
    if (this.flowContext.testRun) {
      return true;
    }

    return await this.flowContext.user.isAllowedToRunFlows();
  }
}

export default FlowValidator;
