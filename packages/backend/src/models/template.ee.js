import Base from './base.js';
import Flow from './flow.js';
import { generateIconUrl } from '../helpers/generate-icon-url.js';

class Template extends Base {
  static tableName = 'templates';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      flowData: { type: 'object' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static async create({ name, flowId }) {
    const flow = await Flow.query().findById(flowId).throwIfNotFound();
    const flowData = await flow.export();

    return this.query().insertAndFetch({ name, flowData });
  }

  getFlowDataWithIconUrls() {
    if (!this.flowData) return null;

    return {
      ...this.flowData,
      steps: this.flowData.steps?.map((step) => ({
        ...step,
        iconUrl: generateIconUrl(step.appKey),
      })),
    };
  }
}

export default Template;
