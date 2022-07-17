// Type definitions for automatisch

export type IJSONValue = string | number | boolean | IJSONObject | IJSONArray;
export type IJSONArray = Array<IJSONValue>;
export interface IJSONObject {
  [x: string]: IJSONValue;
}

export interface IConnection {
  id: string;
  key: string;
  data: string;
  formattedData: IJSONObject;
  userId: string;
  verified: boolean;
  count: number;
  createdAt: string;
}

export interface IExecutionStep {
  id: string;
  executionId: string;
  stepId: IStep["id"];
  step: IStep;
  dataIn: IJSONObject;
  dataOut: IJSONObject;
  status: string;
  createdAt: string;
}

export interface IExecution {
  id: string;
  flowId: string;
  flow: IFlow;
  testRun: boolean;
  executionSteps: IExecutionStep[];
  createdAt: string;
}

export interface IStep {
  id: string;
  name: string;
  flowId: string;
  key: string;
  appKey: string;
  type: 'action' | 'trigger';
  connectionId: string;
  status: string;
  position: number;
  parameters: Record<string, unknown>;
  connection: Partial<IConnection>;
  flow: IFlow;
  executionSteps: IExecutionStep[];
  // FIXME: remove this property once execution steps are properly exposed via queries
  output: IJSONObject;
}

export interface IFlow {
  id: string;
  name: string;
  userId: string;
  active: boolean;
  steps: IStep[];
}

export interface IUser {
  id: string;
  email: string;
  password: string;
  connections: IConnection[];
  flows: IFlow[];
  steps: IStep[];
}

export interface IFieldDropdown {
  key: string;
  label: string;
  type: 'dropdown';
  required: boolean;
  readOnly: boolean;
  value: string;
  placeholder: string | null;
  description: string;
  docUrl: string;
  clickToCopy: boolean;
  name: string;
  variables: boolean;
  dependsOn: string[];
  options: IFieldDropdownOption[];
  source: {
    type: string;
    name: string;
    arguments: {
      name: string;
      value: string;
    }[];
  };
}

export interface IFieldDropdownOption {
  label: string;
  value: boolean | string;
}

export interface IFieldText {
  key: string;
  label: string;
  type: 'string';
  required: boolean;
  readOnly: boolean;
  value: string;
  placeholder: string | null;
  description: string;
  docUrl: string;
  clickToCopy: boolean;
  name: string;
  variables: boolean;
  dependsOn: string[];
}

type IField = IFieldDropdown | IFieldText;

export interface IAuthenticationStepField {
  name: string;
  value: string | null;
  properties: {
    name: string;
    value: string;
  }[];
}

export interface IAuthenticationStep {
  step: number;
  type: 'mutation' | 'openWithPopup';
  name: string;
  arguments: IAuthenticationStepField[];
}

export interface IApp {
  name: string;
  key: string;
  iconUrl: string;
  docUrl: string;
  primaryColor: string;
  fields: IField[];
  authenticationSteps: IAuthenticationStep[];
  reconnectionSteps: IAuthenticationStep[];
  connectionCount: number;
  triggers: any[];
  actions: any[];
  connections: IConnection[];
}

export interface IService {
  authenticationClient?: IAuthentication;
  triggers?: any;
  actions?: any;
  data?: any;
}

export interface ITrigger {
  run(startTime?: Date): Promise<IJSONValue>;
  testRun(startTime?: Date): Promise<IJSONValue>;
}

export interface IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: unknown;
  verifyCredentials(): Promise<IJSONObject>;
  isStillVerified(): Promise<boolean>;
}

export interface ISubstep {
  name: string;
  arguments: IField[];
}

export type IHttpClientParams = {
  baseURL?: string;
}
