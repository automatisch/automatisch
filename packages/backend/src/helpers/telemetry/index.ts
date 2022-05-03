import Analytics, { apiObject } from '@rudderstack/rudder-sdk-node';
import organizationId from './organization-id';
import instanceId from './instance-id';
import appConfig from '../../config/app';

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

  // Example implementation of telemetry methods.
  // TODO: Revise properties for the step.
  // stepUpdated(key: string, appKey: string) {
  //   this.track('Step updated', { key, appKey });
  // }
}

const telemetry = new Telemetry();

export default telemetry;
