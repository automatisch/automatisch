type Config = {
  [key: string]: string;
};

const config: Config = {
  baseUrl: process.env.REACT_APP_BASE_URL as string,
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL as string,
  notificationsUrl: process.env.REACT_APP_NOTIFICATIONS_URL as string,
  chatwootBaseUrl: 'https://app.chatwoot.com',
};

export default config;
