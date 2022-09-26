import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IJSONObject, IHttpClientParams } from '@automatisch/types';

type ExtendedAxiosResponse = AxiosResponse & { integrationError: IJSONObject };

export default class HttpClient {
  instance: AxiosInstance;

  constructor(params: IHttpClientParams) {
    this.instance = axios.create({
      baseURL: params.baseURL,
    });

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        error.response.integrationError = error.response.data;
        return error.response;
      }
    );
  }

  async get(path: string, options?: IJSONObject) {
    return (await this.instance.get(path, options)) as ExtendedAxiosResponse;
  }

  async post(path: string, body: IJSONObject | string, options?: IJSONObject) {
    return (await this.instance.post(
      path,
      body,
      options
    )) as ExtendedAxiosResponse;
  }
}
