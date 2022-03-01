// Type definitions for automatisch

export type IJSONValue = string | number | boolean | JSONObject | JSONArray;
export type IJSONArray = Array<JSONValue>;
export interface IJSONObject {
  [x: string]: JSONValue;
}

export interface IConnection<D extends IJSONObject | string> {
  id: string;
  key: string;
  data: D;
  userId: string;
  verified: boolean;
  count: number;
  createdAt: string;
}

export interface IExecutionStep {
  id: string;
  executionId: string;
  stepId: string;
  dataIn: IJSONObject;
  dataOut: IJSONObject;
  status: string;
}

export interface IExecution {
  id: string;
  flowId: string;
  testRun: boolean;
  executionSteps: IExecutionStep[];
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
  connection: IConnection;
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

export interface IField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  readOnly: boolean;
  value: string;
  placeholder: string | null;
  description: string;
  docUrl: string;
  clickToCopy: boolean;
  name: string;
  variables: boolean;
}

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

export interface IAuthentication {
  appData: IApp;
  connectionData: IJSONObject;
  client: unknown;
  verifyCredentials(): Promise<JSONObject>;
  isStillVerified(): Promise<boolean>;
}

export interface ISubstep {
  name: string;
  arguments: IField[];
}
