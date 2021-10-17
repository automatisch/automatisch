type AppFields = {
  key: string;
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
};

export type { App, AppFields };
