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

type AppConnection = {
  id: string;
  key: string;
  verified: boolean;
  createdAt: string;
  data: {
    [key: string]: any;
  };
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
  connections: AppConnection[];
};

export type { App, AppFields, AppConnection };
