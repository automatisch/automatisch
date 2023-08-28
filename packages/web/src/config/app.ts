type Config = {
  [key: string]: string;
  baseUrl: string;
  graphqlUrl: string;
  chatwootBaseUrl: string;
  supportEmailAddress: string;
};

const config: Config = {
  baseUrl: process.env.REACT_APP_BASE_URL as string,
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL as string,
  chatwootBaseUrl: 'https://app.chatwoot.com',
  supportEmailAddress: 'support@automatisch.io',
};

export default config;
