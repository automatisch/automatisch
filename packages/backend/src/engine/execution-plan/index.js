class ExecutionPlan {
  constructor(triggerStep, actionSteps) {
    this.triggerStep = triggerStep;
    this.actionSteps = actionSteps;
    this.allSteps = [triggerStep, ...actionSteps];
    this.currentStepIndex = 0;
    this.completedSteps = [];
    this.resumeStepId = null;
    this.resumeExecutionId = null;
  }

  getNextStep() {
    if (this.currentStepIndex >= this.allSteps.length) {
      return null;
    }

    return this.allSteps[this.currentStepIndex];
  }

  markStepAsCompleted(step) {
    this.completedSteps.push(step);
    this.currentStepIndex++;
  }

  // Future: This is where branching logic will live
  shouldSkip(step) {
    if (step.isTrigger) return false;
    return false;
  }

  // Future: This is where loop detection will live
  shouldRepeat(step) {
    if (step.isTrigger) return false;
    return false;
  }

  // Yardımcı method: Daha fazla step var mı?
  hasMoreSteps() {
    return this.currentStepIndex < this.allSteps.length;
  }

  // Yardımcı method: Trigger step'i atla ve action'lardan başla
  skipToActionSteps() {
    this.currentStepIndex = 1; // Trigger'dan sonraki ilk action
  }

  // Resume bilgilerini ayarla ve pozisyonu belirle
  initializeResume(resumeStepId, resumeExecutionId) {
    this.resumeStepId = resumeStepId;
    this.resumeExecutionId = resumeExecutionId;

    if (resumeStepId && resumeExecutionId) {
      // Belirli bir step'ten devam et
      const resumeIndex = this.allSteps.findIndex((s) => s.id === resumeStepId);

      if (resumeIndex >= 0) {
        this.currentStepIndex = resumeIndex;
        return true;
      }
    }

    // Normal başlangıç (trigger'dan başla)
    return false;
  }

  // Eski setResumePosition backward compatibility için
  setResumePosition(resumeStepId) {
    return this.initializeResume(resumeStepId, null);
  }

  // Trigger'ı çalıştırmalı mıyız?
  shouldRunTrigger() {
    // Resume durumunda değilsek trigger çalışmalı
    return !this.resumeStepId && !this.resumeExecutionId;
  }

  // Resume durumunda mıyız?
  isResuming() {
    return !!(this.resumeStepId || this.resumeExecutionId);
  }
}

export default ExecutionPlan;
