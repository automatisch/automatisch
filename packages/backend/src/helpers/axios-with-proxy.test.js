import { beforeEach, describe, it, expect, vi } from 'vitest';

describe('Axios with proxy', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should have two interceptors by default', async () => {
    const axios = (await import('./axios-with-proxy.js')).default;
    const requestInterceptors = axios.interceptors.request.handlers;

    expect(requestInterceptors.length).toBe(2);
  });

  it('should have default interceptors in a certain order', async () => {
    const axios = (await import('./axios-with-proxy.js')).default;

    const requestInterceptors = axios.interceptors.request.handlers;
    const firstRequestInterceptor = requestInterceptors[0];
    const secondRequestInterceptor = requestInterceptors[1];

    expect(firstRequestInterceptor.fulfilled.name).toBe('skipProxyIfInNoProxy');
    expect(secondRequestInterceptor.fulfilled.name).toBe('removeBaseUrlForAbsoluteUrls');
  });

  describe('skipProxyIfInNoProxy', () => {
    let appConfig, axios;
    beforeEach(async() => {
      appConfig = (await import('../config/app.js')).default;

      vi.spyOn(appConfig, 'httpProxy', 'get').mockReturnValue('http://proxy.automatisch.io');
      vi.spyOn(appConfig, 'httpsProxy', 'get').mockReturnValue('http://proxy.automatisch.io');
      vi.spyOn(appConfig, 'noProxy', 'get').mockReturnValue('name.tld,automatisch.io');

      axios = (await import('./axios-with-proxy.js')).default;
    });

    it('should skip proxy for hosts in no_proxy environment variable', async () => {
      const skipProxyIfInNoProxy = axios.interceptors.request.handlers[0].fulfilled;

      const mockRequestConfig = {
        ...axios.defaults,
        baseURL: 'https://automatisch.io'
      };

      const interceptedRequestConfig = skipProxyIfInNoProxy(mockRequestConfig);

      expect(interceptedRequestConfig.httpAgent).toBeUndefined();
      expect(interceptedRequestConfig.httpsAgent).toBeUndefined();
      expect(interceptedRequestConfig.proxy).toBe(false);
    });

    it('should not skip proxy for hosts not in no_proxy environment variable', async () => {
      const skipProxyIfInNoProxy = axios.interceptors.request.handlers[0].fulfilled;

      const mockRequestConfig = {
        ...axios.defaults,
        // beware the intentional typo!
        baseURL: 'https://automatish.io'
      };

      const interceptedRequestConfig = skipProxyIfInNoProxy(mockRequestConfig);

      expect(interceptedRequestConfig.httpAgent).toBeDefined();
      expect(interceptedRequestConfig.httpsAgent).toBeDefined();
      expect(interceptedRequestConfig.proxy).toBe(false);
    });
  });

  describe('removeBaseUrlForAbsoluteUrls', () => {
    let axios;
    beforeEach(async() => {
      axios = (await import('./axios-with-proxy.js')).default;
    });

    it('should trim the baseUrl from absolute urls', async () => {
      const removeBaseUrlForAbsoluteUrls = axios.interceptors.request.handlers[1].fulfilled;

      const mockRequestConfig = {
        ...axios.defaults,
        url: 'https://automatisch.io/path'
      };

      const interceptedRequestConfig = removeBaseUrlForAbsoluteUrls(mockRequestConfig);

      expect(interceptedRequestConfig.baseURL).toBe('https://automatisch.io');
      expect(interceptedRequestConfig.url).toBe('/path');
    });

    it('should not mutate separate baseURL and urls', async () => {
      const removeBaseUrlForAbsoluteUrls = axios.interceptors.request.handlers[1].fulfilled;

      const mockRequestConfig = {
        ...axios.defaults,
        baseURL: 'https://automatisch.io',
        url: '/path?query=1'
      };

      const interceptedRequestConfig = removeBaseUrlForAbsoluteUrls(mockRequestConfig);

      expect(interceptedRequestConfig.baseURL).toBe('https://automatisch.io');
      expect(interceptedRequestConfig.url).toBe('/path?query=1');
    });

    it('should not strip querystring from url', async () => {
      const removeBaseUrlForAbsoluteUrls = axios.interceptors.request.handlers[1].fulfilled;

      const mockRequestConfig = {
        ...axios.defaults,
        url: 'https://automatisch.io/path?query=1'
      };

      const interceptedRequestConfig = removeBaseUrlForAbsoluteUrls(mockRequestConfig);

      expect(interceptedRequestConfig.baseURL).toBe('https://automatisch.io');
      expect(interceptedRequestConfig.url).toBe('/path?query=1');
    });
  });
});
