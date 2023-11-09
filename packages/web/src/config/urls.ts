export const CONNECTIONS = '/connections';
export const EXECUTIONS = '/executions';
export const EXECUTION_PATTERN = '/executions/:executionId';
export const EXECUTION = (executionId: string) => `/executions/${executionId}`;

export const LOGIN = '/login';
export const LOGIN_CALLBACK = `${LOGIN}/callback`;
export const SIGNUP = '/sign-up';
export const FORGOT_PASSWORD = '/forgot-password';
export const RESET_PASSWORD = '/reset-password';

export const APPS = '/apps';
export const NEW_APP_CONNECTION = '/apps/new';
export const APP = (appKey: string) => `/app/${appKey}`;
export const APP_PATTERN = '/app/:appKey';
export const APP_CONNECTIONS = (appKey: string) => `/app/${appKey}/connections`;
export const APP_CONNECTIONS_PATTERN = '/app/:appKey/connections';
export const APP_ADD_CONNECTION = (appKey: string, shared = false) =>
  `/app/${appKey}/connections/add?shared=${shared}`;
export const APP_ADD_CONNECTION_WITH_AUTH_CLIENT_ID = (
  appKey: string,
  appAuthClientId: string
) => `/app/${appKey}/connections/add?appAuthClientId=${appAuthClientId}`;
export const APP_ADD_CONNECTION_PATTERN = '/app/:appKey/connections/add';
export const APP_RECONNECT_CONNECTION = (
  appKey: string,
  connectionId: string,
  appAuthClientId?: string
) => {
  const path = `/app/${appKey}/connections/${connectionId}/reconnect`;

  if (appAuthClientId) {
    return `${path}?appAuthClientId=${appAuthClientId}`;
  }

  return path;
};
export const APP_RECONNECT_CONNECTION_PATTERN =
  '/app/:appKey/connections/:connectionId/reconnect';
export const APP_FLOWS = (appKey: string) => `/app/${appKey}/flows`;
export const APP_FLOWS_FOR_CONNECTION = (
  appKey: string,
  connectionId: string
) => `/app/${appKey}/flows?connectionId=${connectionId}`;
export const APP_FLOWS_PATTERN = '/app/:appKey/flows';

export const EDITOR = '/editor';
export const CREATE_FLOW = '/editor/create';
export const CREATE_FLOW_WITH_APP = (appKey: string) =>
  `/editor/create?appKey=${appKey}`;
export const CREATE_FLOW_WITH_APP_AND_CONNECTION = (
  appKey?: string,
  connectionId?: string
) => {
  const params: { appKey?: string; connectionId?: string } = {};

  if (appKey) {
    params.appKey = appKey;
  }

  if (connectionId) {
    params.connectionId = connectionId;
  }

  const searchParams = new URLSearchParams(params).toString();

  return `/editor/create?${searchParams}`;
};
export const FLOW_EDITOR = (flowId: string) => `/editor/${flowId}`;

export const FLOWS = '/flows';
// TODO: revert this back to /flows/:flowId once we have a proper single flow page
export const FLOW = (flowId: string) => `/editor/${flowId}`;
export const FLOW_PATTERN = '/flows/:flowId';

export const SETTINGS = '/settings';
export const SETTINGS_DASHBOARD = SETTINGS;
export const PROFILE = 'profile';
export const BILLING_AND_USAGE = 'billing';
export const PLAN_UPGRADE = 'upgrade';
export const UPDATES = '/updates';
export const SETTINGS_PROFILE = `${SETTINGS}/${PROFILE}`;
export const SETTINGS_BILLING_AND_USAGE = `${SETTINGS}/${BILLING_AND_USAGE}`;
export const SETTINGS_PLAN_UPGRADE = `${SETTINGS_BILLING_AND_USAGE}/${PLAN_UPGRADE}`;

export const ADMIN_SETTINGS = '/admin-settings';
export const ADMIN_SETTINGS_DASHBOARD = ADMIN_SETTINGS;
export const USERS = `${ADMIN_SETTINGS}/users`;
export const USER = (userId: string) => `${USERS}/${userId}`;
export const USER_PATTERN = `${USERS}/:userId`;
export const CREATE_USER = `${USERS}/create`;
export const ROLES = `${ADMIN_SETTINGS}/roles`;
export const ROLE = (roleId: string) => `${ROLES}/${roleId}`;
export const ROLE_PATTERN = `${ROLES}/:roleId`;
export const CREATE_ROLE = `${ROLES}/create`;
export const USER_INTERFACE = `${ADMIN_SETTINGS}/user-interface`;
export const AUTHENTICATION = `${ADMIN_SETTINGS}/authentication`;
export const ADMIN_APPS = `${ADMIN_SETTINGS}/apps`;
export const ADMIN_APP = (appKey: string) => `${ADMIN_SETTINGS}/apps/${appKey}`;
export const ADMIN_APP_PATTERN = `${ADMIN_SETTINGS}/apps/:appKey`;
export const ADMIN_APP_SETTINGS_PATTERN = `${ADMIN_SETTINGS}/apps/:appKey/settings`;
export const ADMIN_APP_AUTH_CLIENTS_PATTERN = `${ADMIN_SETTINGS}/apps/:appKey/auth-clients`;
export const ADMIN_APP_CONNECTIONS_PATTERN = `${ADMIN_SETTINGS}/apps/:appKey/connections`;
export const ADMIN_APP_CONNECTIONS = (appKey: string) =>
  `${ADMIN_SETTINGS}/apps/${appKey}/connections`;
export const ADMIN_APP_SETTINGS = (appKey: string) =>
  `${ADMIN_SETTINGS}/apps/${appKey}/settings`;
export const ADMIN_APP_AUTH_CLIENTS = (appKey: string) =>
  `${ADMIN_SETTINGS}/apps/${appKey}/auth-clients`;
export const ADMIN_APP_AUTH_CLIENT = (appKey: string, id: string) =>
  `${ADMIN_SETTINGS}/apps/${appKey}/auth-clients/${id}`;
export const ADMIN_APP_AUTH_CLIENTS_CREATE = (appKey: string) =>
  `${ADMIN_SETTINGS}/apps/${appKey}/auth-clients/create`;

export const DASHBOARD = FLOWS;

// External links
export const WEBHOOK_DOCS =
  'https://automatisch.io/docs/apps/webhooks/connection';
