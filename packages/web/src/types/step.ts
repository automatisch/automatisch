export type Step = {
  id: string;
  key: string;
  appKey: string;
  type: 'trigger' | 'action';
  connectionId: number;
};
