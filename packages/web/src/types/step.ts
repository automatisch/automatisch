import type { AppFields } from './app';
import type { Connection } from './connection';

export enum StepType {
  Trigger = 'trigger',
  Action = 'action',
}

export type Step = {
  id: string;
  key: string | null;
  name: string;
  appKey: string | null;
  type: StepType;
  previousStepId: string | null;
  parameters: Record<string, unknown>;
  connection: Pick<Connection, 'id' | 'verified'>;
  status: 'completed' | 'incomplete';
  output: Record<string, unknown>;
};

export type Substep = {
  name: string;
  arguments: AppFields[];
};
