type AppFields = {
  key: string;
  label: string;
  type: string;
  required: boolean,
  readOnly: boolean,
  placeholder: string;
  description: string;
  docUrl: string;
  clickToCopy: boolean,
};

type App = {
  name: string;
  iconUrl: string;
  docUrl: string;
  primaryColor: string;
  fields: AppFields;
};

export type { App, AppFields };
