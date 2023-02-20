type Config = {
  [key: string]: string;
};

const config: Config = {
  graphqlUrl: process.env.REACT_APP_GRAPHQL_URL as string,
  notificationsUrl: process.env.REACT_APP_NOTIFICATIONS_URL as string,
};

export default config;
