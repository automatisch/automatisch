import type { Step } from './step';

export type Flow = {
  id: string;
  name: string;
  steps: Step[];
  active: boolean;
};
