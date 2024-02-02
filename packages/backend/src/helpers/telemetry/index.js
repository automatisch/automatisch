import Analytics from '@rudderstack/rudder-sdk-node';
import organizationId from './organization-id.js';
import instanceId from './instance-id.js';
import appConfig from '../../config/app.js';
import os from 'os';

const WRITE_KEY = '284Py4VgK2MsNYV7xlKzyrALx0v';
const DATA_PLANE_URL = 'https://telemetry.automatisch.io/v1/batch';
const CPUS = os.cpus();
const SIX_HOURS_IN_MILLISECONDS = 21600000;

class Telemetry {
  constructor() {
    this.client = new Analytics(WRITE_KEY, DATA_PLANE_URL);
    this.organizationId = organizationId();
    this.instanceId = instanceId();
  }

  setServiceType(type) {
    this.serviceType = type;
  }

  track(name, properties) {
    if (!appConfig.telemetryEnabled) {
      return;
    }

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

  stepCreated(step) {
    this.track('stepCreated', {
      stepId: step.id,
      flowId: step.flowId,
      createdAt: step.createdAt,
      updatedAt: step.updatedAt,
    });
  }

  stepUpdated(step) {
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

  flowCreated(flow) {
    this.track('flowCreated', {
      flowId: flow.id,
      name: flow.name,
      active: flow.active,
      createdAt: flow.createdAt,
      updatedAt: flow.updatedAt,
    });
  }

  flowUpdated(flow) {
    this.track('flowUpdated', {
      flowId: flow.id,
      name: flow.name,
      active: flow.active,
      createdAt: flow.createdAt,
      updatedAt: flow.updatedAt,
    });
  }

  executionCreated(execution) {
    this.track('executionCreated', {
      executionId: execution.id,
      flowId: execution.flowId,
      testRun: execution.testRun,
      createdAt: execution.createdAt,
      updatedAt: execution.updatedAt,
    });
  }

  executionStepCreated(executionStep) {
    this.track('executionStepCreated', {
      executionStepId: executionStep.id,
      executionId: executionStep.executionId,
      stepId: executionStep.stepId,
      status: executionStep.status,
      createdAt: executionStep.createdAt,
      updatedAt: executionStep.updatedAt,
    });
  }

  connectionCreated(connection) {
    this.track('connectionCreated', {
      connectionId: connection.id,
      key: connection.key,
      verified: connection.verified,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    });
  }

  connectionUpdated(connection) {
    this.track('connectionUpdated', {
      connectionId: connection.id,
      key: connection.key,
      verified: connection.verified,
      createdAt: connection.createdAt,
      updatedAt: connection.updatedAt,
    });
  }

  diagnosticInfo() {
    this.track('diagnosticInfo', {
      automatischVersion: appConfig.version,
      serveWebAppSeparately: appConfig.serveWebAppSeparately,
      serviceType: this.serviceType,
      operatingSystem: {
        type: os.type(),
        version: os.version(),
      },
      memory: os.totalmem() / (1024 * 1024), // To get as megabytes
      cpus: {
        count: CPUS.length,
        model: CPUS[0].model,
        speed: CPUS[0].speed,
      },
    });

    setTimeout(() => this.diagnosticInfo(), SIX_HOURS_IN_MILLISECONDS);
  }
}

const telemetry = new Telemetry();
telemetry.diagnosticInfo();

export default telemetry;
