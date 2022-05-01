import Analytics, { apiObject } from '@rudderstack/rudder-sdk-node';

const WRITE_KEY = '284Py4VgK2MsNYV7xlKzyrALx0v';
const DATA_PLANE_URL = 'https://telemetry.automatisch.io/v1/batch';

class Telemetry {
  instanceId: string;
  client: Analytics;

  constructor() {
    this.client = new Analytics(WRITE_KEY, DATA_PLANE_URL);
  }

  track(name: string, properties: apiObject) {
    this.client.track({
      userId: 'sample',
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
