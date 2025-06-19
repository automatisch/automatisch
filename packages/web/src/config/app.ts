type Config = {
  [key: string]: string;
  baseUrl: string;
  apiUrl: string;
  graphqlUrl: string;
  notificationsUrl: string;
  chatwootBaseUrl: string;
  supportEmailAddress: string;
};

const config: Config = {
  baseUrl: process.env.REACT_APP_BASE_URL as string,
  apiUrl: process.env.REACT_APP_API_URL as string,
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL as string,
  notificationsUrl: process.env.REACT_APP_NOTIFICATIONS_URL as string,
  chatwootBaseUrl: 'https://app.chatwoot.com',
  supportEmailAddress: 'support@automatisch.io'
};

if (!config.apiUrl) {
  config.apiUrl = (new URL(config.graphqlUrl)).origin;
}

export default config;
