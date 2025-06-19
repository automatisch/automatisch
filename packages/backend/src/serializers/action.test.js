import { describe, it, expect } from 'vitest';
import App from '@/models/app.js';
import actionSerializer from '@/serializers/action.js';

describe('actionSerializer', () => {
  it('should return the action data', async () => {
    const actions = await App.findActionsByKey('github');
    const action = actions[0];

    const expectedPayload = {
      description: action.description,
      key: action.key,
      name: action.name,
      pollInterval: action.pollInterval,
      showWebhookUrl: action.showWebhookUrl,
      type: action.type,
    };

    expect(expectedPayload).toMatchObject(actionSerializer(action));
  });
});
