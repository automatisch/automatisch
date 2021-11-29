type Config = {
  [key: string]: string,
};

const API_URL: string = process.env.REACT_APP_API_URL as string;
const BASE_URL: string = (
  process.env.REACT_APP_BASE_URL
  || process.env.RENDER_EXTERNAL_URL) as string;

const config: Config = {
  baseUrl: BASE_URL,
  apiUrl: API_URL,
  graphqlUrl: `${API_URL}/graphql`,
};

export default config;
