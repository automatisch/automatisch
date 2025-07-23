import { describe, it, expect, vi } from 'vitest';
import Crypto from 'crypto';
import User from '@/models/user.js';
import { logger } from '@/helpers/logger.js';
import { createFlow } from '@/factories/flow.js';
import { createUser } from '@/factories/user.js';
import { runExecutor } from './index.js';

describe('runExecutor', () => {
  it('should return early when flow is not found', async () => {
    const flowId = Crypto.randomUUID();
    const testRun = false;

    const loggerSpy = vi.spyOn(logger, 'info');
    await runExecutor({ flowId, testRun });

    expect(loggerSpy).toHaveBeenCalledWith(`Flow ${flowId} not found!`);
  });

  it('should return early when user is not allowed to run flows', async () => {
    const testRun = false;

    const user = await createUser();
    const flow = await createFlow({ userId: user.id });

    vi.spyOn(User.prototype, 'isAllowedToRunFlows').mockResolvedValue(false);
    const loggerSpy = vi.spyOn(logger, 'info');

    await runExecutor({ flowId: flow.id, testRun });

    expect(loggerSpy).toHaveBeenCalledWith(
      `User ${user.id} is not allowed to run flows!`
    );
  });
});
