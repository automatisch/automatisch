import type { AxiosInstance, AxiosRequestConfig } from 'axios';
export type IHttpClient = AxiosInstance;
import type { Request } from 'express';

// Type definitions for automatisch

export type IJSONValue =
  | string
  | number
  | boolean
  | null
  | IJSONObject
  | IJSONArray;
export type IJSONArray = Array<IJSONValue>;
export interface IJSONObject {
  [x: string]: IJSONValue;
}

export interface IConnection {
  id: string;
  key: string;
  data: string;
  formattedData?: IJSONObject;
  userId: string;
  verified: boolean;
  count?: number;
  flowCount?: number;
  appData?: IApp;
  createdAt: string;
  reconnectable?: boolean;
  appAuthClientId?: string;
}

export interface IExecutionStep {
  id: string;
  executionId: string;
  stepId: IStep['id'];
  step: IStep;
  dataIn: IJSONObject;
  dataOut: IJSONObject;
  errorDetails: IJSONObject;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExecution {
  id: string;
  flowId: string;
  flow: IFlow;
  testRun: boolean;
  status: 'success' | 'failure';
  executionSteps: IExecutionStep[];
  updatedAt: string | Date;
  createdAt: string | Date;
}

export interface IStep {
  id: string;
  name?: string;
  flowId: string;
  key?: string;
  appKey?: string;
  iconUrl: string;
  webhookUrl?: string;
  type: 'action' | 'trigger';
  connectionId?: string;
  status: string;
  position: number;
  parameters: IJSONObject;
  connection?: Partial<IConnection>;
  flow: IFlow;
  executionSteps: IExecutionStep[];
  // FIXME: remove this property once execution steps are properly exposed via queries
  output?: IJSONObject;
  appData?: IApp;
}

export interface IFlow {
  id: string;
  name: string;
  userId: string;
  active: boolean;
  status: 'paused' | 'published' | 'draft';
  steps: IStep[];
  createdAt: string | Date;
  updatedAt: string | Date;
  remoteWebhookId: string;
  lastInternalId: () => Promise<string>;
}

export interface IUser {
  id: string;
  fullName: string;
  email: string;
  password: string;
  connections: IConnection[];
  flows: IFlow[];
  steps: IStep[];
  role: IRole;
  permissions: IPermission[];
  createdAt: string | Date;
  updatedAt: string | Date;
  trialExpiryDate: string | Date;
}

export interface IRole {
  id: string;
  key: string;
  name: string;
  description: string;
  isAdmin: boolean;
  permissions: IPermission[];
}

export interface IPermission {
  id: string;
  action: string;
  subject: string;
  conditions: string[];
}

export interface IPermissionCatalog {
  actions: { label: string; key: string; subjects: string[] }[];
  subjects: { label: string; key: string }[];
  conditions: { label: string; key: string }[];
}

export interface IConfig {
  id: string;
  key: string;
  value: IJSONObject;
}

export interface IFieldDropdown {
  key: string;
  label: string;
  type: 'dropdown';
  required: boolean;
  readOnly?: boolean;
  value?: string | boolean;
  placeholder?: string | null;
  description?: string;
  docUrl?: string;
  clickToCopy?: boolean;
  variables?: boolean;
  dependsOn?: string[];
  options?: IFieldDropdownOption[];
  source?: IFieldDropdownSource;
  additionalFields?: IFieldDropdownAdditionalFields;
}

export interface IFieldDropdownSource {
  type: string;
  name: string;
  arguments: {
    name: string;
    value: string;
  }[];
}
export interface IFieldDropdownAdditionalFields {
  type: string;
  name: string;
  arguments: {
    name: string;
    value: string;
  }[];
}

export interface IFieldDropdownOption {
  label: string;
  value: boolean | string | number;
}

export interface IFieldText {
  key: string;
  label: string;
  type: 'string';
  required?: boolean;
  readOnly?: boolean;
  value?: string;
  placeholder?: string | null;
  description?: string;
  docUrl?: string;
  clickToCopy?: boolean;
  variables?: boolean;
  dependsOn?: string[];
}

export interface IFieldDynamic {
  key: string;
  label: string;
  type: 'dynamic';
  required?: boolean;
  readOnly?: boolean;
  description?: string;
  value?: Record<string, unknown>[];
  fields: (IFieldDropdown | IFieldText)[];
}

export type IField = IFieldDropdown | IFieldText | IFieldDynamic;

export interface IAuthenticationStepField {
  name: string;
  value: string | null;
  properties?: {
    name: string;
    value: string;
  }[];
}

export interface IAuthenticationStep {
  type: 'mutation' | 'openWithPopup';
  name: string;
  arguments: IAuthenticationStepField[];
}

export interface IApp {
  name: string;
  key: string;
  iconUrl: string;
  docUrl?: string;
  authDocUrl: string;
  primaryColor: string;
  supportsConnections: boolean;
  apiBaseUrl: string;
  baseUrl: string;
  auth?: IAuth;
  connectionCount?: number;
  flowCount?: number;
  beforeRequest?: TBeforeRequest[];
  dynamicData?: IDynamicData;
  dynamicFields?: IDynamicFields;
  triggers?: ITrigger[];
  actions?: IAction[];
  connections?: IConnection[];
}

export type TBeforeRequest = {
  ($: IGlobalVariable, requestConfig: AxiosRequestConfig): AxiosRequestConfig;
};

export interface IDynamicData {
  [index: string]: any;
}

export interface IDynamicFields {
  [index: string]: any;
}

export interface IAuth {
  generateAuthUrl?($: IGlobalVariable): Promise<void>;
  verifyCredentials?($: IGlobalVariable): Promise<void>;
  isStillVerified?($: IGlobalVariable): Promise<boolean>;
  refreshToken?($: IGlobalVariable): Promise<void>;
  verifyWebhook?($: IGlobalVariable): Promise<boolean>;
  isRefreshTokenRequested?: boolean;
  fields?: IField[];
  authenticationSteps?: IAuthenticationStep[];
  reconnectionSteps?: IAuthenticationStep[];
  sharedAuthenticationSteps?: IAuthenticationStep[];
  sharedReconnectionSteps?: IAuthenticationStep[];
}

export interface ITriggerOutput {
  data: ITriggerItem[];
  error?: IJSONObject;
}

export interface ITriggerItem {
  raw: IJSONObject;
  meta: {
    internalId: string;
  };
}

export interface IBaseTrigger {
  name: string;
  key: string;
  type?: 'webhook' | 'polling';
  showWebhookUrl?: boolean;
  pollInterval?: number;
  description: string;
  useSingletonWebhook?: boolean;
  singletonWebhookRefValueParameter?: string;
  getInterval?(parameters: IStep['parameters']): string;
  run?($: IGlobalVariable): Promise<void>;
  testRun?($: IGlobalVariable): Promise<void>;
  registerHook?($: IGlobalVariable): Promise<void>;
  unregisterHook?($: IGlobalVariable): Promise<void>;
}

export interface IRawTrigger extends IBaseTrigger {
  arguments?: IField[];
}

export interface ITrigger extends IBaseTrigger {
  substeps?: ISubstep[];
}

export interface IActionOutput {
  data: IActionItem;
  error?: IJSONObject;
}

export interface IActionItem {
  raw: IJSONObject;
}

export interface IBaseAction {
  name: string;
  key: string;
  description: string;
  run?($: IGlobalVariable): Promise<void>;
}

export interface IRawAction extends IBaseAction {
  arguments?: IField[];
}

export interface IAction extends IBaseAction {
  substeps?: ISubstep[];
}

export interface IAuthentication {
  client: unknown;
  verifyCredentials(): Promise<IJSONObject>;
  isStillVerified(): Promise<boolean>;
}

export interface ISubstep {
  key: string;
  name: string;
  arguments?: IField[];
}

export type IHttpClientParams = {
  $: IGlobalVariable;
  baseURL?: string;
  beforeRequest?: TBeforeRequest[];
};

export type IGlobalVariable = {
  auth: {
    set: (args: IJSONObject) => Promise<null>;
    data: IJSONObject;
  };
  app?: IApp;
  http?: IHttpClient;
  request?: IRequest;
  flow?: {
    id: string;
    lastInternalId: string;
    isAlreadyProcessed?: (internalId: string) => boolean;
    remoteWebhookId?: string;
    setRemoteWebhookId?: (remoteWebhookId: string) => Promise<void>;
  };
  step?: {
    id: string;
    appKey: string;
    parameters: IJSONObject;
  };
  nextStep?: {
    id: string;
    appKey: string;
    parameters: IJSONObject;
  };
  execution?: {
    id: string;
    testRun: boolean;
    exit: () => void;
  };
  getLastExecutionStep?: () => Promise<IExecutionStep>;
  webhookUrl?: string;
  singletonWebhookUrl?: string;
  triggerOutput?: ITriggerOutput;
  actionOutput?: IActionOutput;
  pushTriggerItem?: (triggerItem: ITriggerItem) => void;
  setActionItem?: (actionItem: IActionItem) => void;
};

export type TPaymentPlan = {
  price: string;
  name: string;
  limit: string;
  productId: string;
};

export type TSubscription = {
  status: string;
  monthlyQuota: {
    title: string;
    action: BillingCardAction;
  };
  nextBillDate: {
    title: string;
    action: BillingCardAction;
  };
  nextBillAmount: {
    title: string;
    action: BillingCardAction;
  };
};

type TBillingCardAction = TBillingTextCardAction | TBillingLinkCardAction;

type TBillingTextCardAction = {
  type: 'text';
  text: string;
};

type TBillingLinkCardAction = {
  type: 'link';
  text: string;
  src: string;
};

type TInvoice = {
  id: number;
  amount: number;
  currency: string;
  payout_date: string;
  receipt_url: string;
};

type TSamlAuthProvider = {
  id: string;
  name: string;
  certificate: string;
  signatureAlgorithm: 'sha1' | 'sha256' | 'sha512';
  issuer: string;
  entryPoint: string;
  firstnameAttributeName: string;
  surnameAttributeName: string;
  emailAttributeName: string;
  roleAttributeName: string;
  defaultRoleId: string;
  active: boolean;
  loginUrl: string;
};

type TSamlAuthProviderRole = {
  id: string;
  samlAuthProviderId: string;
  roleId: string;
  remoteRoleName: string;
};

type AppConfig = {
  id: string;
  key: string;
  allowCustomConnection: boolean;
  canConnect: boolean;
  canCustomConnect: boolean;
  shared: boolean;
  disabled: boolean;
};

type AppAuthClient = {
  id: string;
  name: string;
  appConfigId: string;
  authDefaults: string;
  formattedAuthDefaults: IJSONObject;
  active: boolean;
};

type Notification = {
  name: string;
  createdAt: string;
  documentationUrl: string;
  description: string;
};

declare module 'axios' {
  interface AxiosResponse {
    httpError?: IJSONObject;
  }

  interface AxiosRequestConfig {
    additionalProperties?: Record<string, unknown>;
  }

  // ref: https://github.com/axios/axios/issues/5095
  interface AxiosInstance {
    create(config?: CreateAxiosDefaults): AxiosInstance;
  }
}

export interface IRequest extends Request {
  rawBody?: Buffer;
  currentUser?: IUser;
}
