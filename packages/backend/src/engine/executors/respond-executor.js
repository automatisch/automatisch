class RespondExecutor {
  async execute(step, executionStep, context) {
    if (!this.isRespondStep(step)) {
      return this.createContinueResponse();
    }

    if (!this.shouldRespond(context)) {
      return this.createContinueResponse();
    }

    return this.createHttpResponse(executionStep);
  }

  isRespondStep(step) {
    return this.isStandardRespond(step) || this.isVoiceXmlRespond(step);
  }

  isStandardRespond(step) {
    return step.key === 'respondWith';
  }

  isVoiceXmlRespond(step) {
    return step.key === 'respondWithVoiceXml';
  }

  shouldRespond(context) {
    return context.isTriggeredByRequest();
  }

  createHttpResponse(executionStep) {
    const responseData = this.extractResponseData(executionStep);
    return this.formatResponse(responseData);
  }

  extractResponseData(executionStep) {
    const { headers, statusCode, body } = executionStep.dataOut || {};
    return { headers, statusCode, body };
  }

  formatResponse({ headers, statusCode, body }) {
    return {
      shouldExit: true,
      exitResponse: {
        statusCode,
        body,
        headers,
      },
    };
  }

  createContinueResponse() {
    return { shouldContinue: true };
  }
}

export default RespondExecutor;
