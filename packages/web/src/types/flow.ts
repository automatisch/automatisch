import type { Step } from './step';

export type Flow = {
  id: number;
  name: string;
  steps: Step[];
  active: boolean;
};
