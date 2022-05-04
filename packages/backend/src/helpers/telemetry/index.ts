import Analytics, { apiObject } from '@rudderstack/rudder-sdk-node';
import organizationId from './organization-id';
import instanceId from './instance-id';
import appConfig from '../../config/app';
import Step from '../../models/step';
import Flow from '../../models/flow';
import Execution from '../../models/execution';
import ExecutionStep from '../../models/execution-step';

const WRITE_KEY = '284Py4VgK2MsNYV7xlKzyrALx0v';
const DATA_PLANE_URL = 'https://telemetry.automatisch.io/v1/batch';

class Telemetry {
  organizationId: string;
  instanceId: string;
  client: Analytics;

  constructor() {
    this.client = new Analytics(WRITE_KEY, DATA_PLANE_URL);
    this.organizationId = organizationId();
    this.instanceId = instanceId();
  }

  track(name: string, properties: apiObject) {
    properties = {
      ...properties,
      appEnv: appConfig.appEnv,
      instanceId: this.instanceId,
    };

    this.client.track({
      userId: this.organizationId,
      event: name,
      properties,
    });
  }

  stepCreated(step: Step) {
    this.track('stepCreated', {
      stepId: step.id,
      flowId: step.flowId,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
    });
  }

  stepUpdated(step: Step) {
    this.track('stepUpdated', {
      stepId: step.id,
      flowId: step.flowId,
      key: step.key,
      appKey: step.appKey,
      type: step.type,
      position: step.position,
      status: step.status,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
    });
  }

  flowCreated(flow: Flow) {
    this.track('flowCreated', {
      flowId: flow.id,
      name: flow.name,
      active: flow.active,
      createdAt: flow.createdAt,
      updatedAt: flow.updatedAt,
    });
  }

  flowUpdated(flow: Flow) {
    this.track('flowUpdated', {
      flowId: flow.id,
      name: flow.name,
      active: flow.active,
      createdAt: flow.createdAt,
      updatedAt: flow.updatedAt,
    });
  }

  executionCreated(execution: Execution) {
    this.track('executionCreated', {
      executionId: execution.id,
      flowId: execution.flowId,
      testRun: execution.testRun,
      createdAt: execution.createdAt,
      updatedAt: execution.updatedAt,
    });
  }

  executionStepCreated(executionStep: ExecutionStep) {
    this.track('executionStepCreated', {
      executionStepId: executionStep.id,
      executionId: executionStep.executionId,
      stepId: executionStep.stepId,
      status: executionStep.status,
      createdAt: executionStep.createdAt,
      updatedAt: executionStep.updatedAt,
    });
  }
}

const telemetry = new Telemetry();

export default telemetry;
