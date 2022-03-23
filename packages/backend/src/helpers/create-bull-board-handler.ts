import { ExpressAdapter } from '@bull-board/express';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import processorQueue from '../queues/processor';

const serverAdapter = new ExpressAdapter();

const createBullBoardHandler = async (serverAdapter: ExpressAdapter) => {
  createBullBoard({
    queues: [new BullMQAdapter(processorQueue)],
    serverAdapter: serverAdapter,
  });
};

export { createBullBoardHandler, serverAdapter };
