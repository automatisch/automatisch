export const DASHBOARD = '/dashboard';
export const APPS = '/apps';
export const FLOWS = '/flows';
export const EXPLORE = '/explore';
export const APP = (appKey: string) => `/app/${appKey}`;
export const APP_PATTERN = '/app/:key';
export const APP_CONNECTIONS = (appKey: string) => `/app/${appKey}/connections`;
export const APP_CONNECTIONS_PATTERN = '/app/:key/connections';
export const APP_ADD_CONNECTION = (appKey: string) => `/app/${appKey}/connections/add`;
export const APP_ADD_CONNECTION_PATTERN = '/app/:key/connections/add';
export const APP_FLOWS = (appKey: string) => `/app/${appKey}/flows`;
export const APP_FLOWS_PATTERN = '/app/:key/flows';

export const NEW_APP_CONNECTION = '/apps/new';