import axios from 'axios';
export { AxiosInstance as IHttpClient } from 'axios';
import { IHttpClientParams } from '@automatisch/types';

export default function createcreateHttpClient({ baseURL, }: IHttpClientParams) {
  const instance = axios.create({
    baseURL,
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      error.response.integrationError = error.response.data;
      return error.response;
    }
  );

  return instance;
}
