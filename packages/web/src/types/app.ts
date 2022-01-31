type AppFields = {
  key: string;
  name: string;
  label: string;
  type: string;
  required: boolean,
  readOnly: boolean,
  value: string;
  description: string;
  docUrl: string;
  clickToCopy: boolean,
};

type App = {
  key: string;
  name: string;
  connectionCount: number;
  iconUrl: string;
  docUrl: string;
  primaryColor: string;
  fields: AppFields[];
  authenticationSteps: any[];
  reconnectionSteps: any[];
  triggers: any[];
  actions: any[];
};

export type { App, AppFields };
