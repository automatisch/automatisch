export enum StepType {
  Trigger = 'trigger',
  Action = 'action',
}

export type Step = {
  id: string;
  key: string;
  name: string;
  appKey: string;
  type: StepType;
  previousStepId: number | null;
  connection: {
    id: number;
  };
};
