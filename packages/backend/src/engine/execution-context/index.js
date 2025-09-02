class ExecutionContext {
  constructor(flow, executionId, testRun = false) {
    this.flow = flow;
    this.executionId = executionId;
    this.testRun = testRun;

    // Step sonuçlarını sakla
    this.stepResults = new Map();

    // Geçerli execution durumu
    this.currentStepId = null;
    this.lastExecutionStep = null;

    // Resume bilgileri
    this.resumeStepId = null;
    this.resumeExecutionId = null;

    // Ek bilgiler (StepExecutor için)
    this.initialDataItem = null;
    this.triggeredByRequest = false;
    this.untilStep = null;
  }

  // Step sonucunu kaydet
  addStepResult(stepId, executionStep) {
    this.stepResults.set(stepId, executionStep);
    this.lastExecutionStep = executionStep;
    this.currentStepId = stepId;
  }

  // Step sonucunu al
  getStepResult(stepId) {
    return this.stepResults.get(stepId);
  }

  // Son execution step'i al
  getLastExecutionStep() {
    return this.lastExecutionStep;
  }

  // Erken çıkış durumu kontrolü
  shouldEarlyExit() {
    return (
      this.lastExecutionStep?.isEarlyExit || this.lastExecutionStep?.isStopped
    );
  }

  // Test durumu kontrolü
  isTestRun() {
    return this.testRun;
  }

  // Resume durumu ayarla
  setResumeInfo(resumeStepId, resumeExecutionId) {
    this.resumeStepId = resumeStepId;
    this.resumeExecutionId = resumeExecutionId;
  }

  // ExecutionId güncelle
  updateExecutionId(newExecutionId) {
    this.executionId = newExecutionId;
  }

  // İlk data'yı ayarla
  setInitialData(initialDataItem, triggeredByRequest, untilStep) {
    this.initialDataItem = initialDataItem;
    this.triggeredByRequest = triggeredByRequest;
    this.untilStep = untilStep;
  }

  // Test run ve until step kontrolü
  shouldStopAtStep(stepId) {
    return this.testRun && this.untilStep && stepId === this.untilStep.id;
  }

  // Request ile tetiklendi mi?
  isTriggeredByRequest() {
    return this.triggeredByRequest;
  }
}

export default ExecutionContext;
