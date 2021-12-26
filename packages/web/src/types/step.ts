export enum StepType {
  Trigger = 'trigger',
  Action = 'action',
}

export type Step = {
  id: string;
  key: string;
  appKey: string;
  type: StepType;
  connectionId: number;
};
