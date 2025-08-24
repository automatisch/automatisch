import flowQueue from '@/queues/flow.js';

export async function setup() {
  await flowQueue.obliterate({ force: true });
}
