import axios, { AxiosInstance } from 'axios';
import { IJSONObject, IHttpClientParams } from '@automatisch/types';

export default class HttpClient {
  instance: AxiosInstance;

  constructor(params: IHttpClientParams) {
    this.instance = axios.create({
      baseURL: params.baseURL,
    });
  }

  async get(path: string, options?: IJSONObject) {
    return await this.instance.get(path, options);
  }

  async post(path: string, body: IJSONObject | string, options?: IJSONObject) {
    return await this.instance.post(path, body, options);
  }
}
