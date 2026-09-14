import { AxiosHeaders } from 'axios';

export const SENT_API_ORIGIN = 'https://api.sent.dm';
export const SENT_API_PATH_PREFIX = '/v3';

const getEffectiveUrl = (requestConfig) => {
  try {
    return new URL(requestConfig.url ?? '', requestConfig.baseURL || undefined);
  } catch {
    return null;
  }
};

const isSentApiUrl = (url) => {
  if (!url || url.origin !== SENT_API_ORIGIN) return false;

  return (
    url.pathname === SENT_API_PATH_PREFIX ||
    url.pathname.startsWith(`${SENT_API_PATH_PREFIX}/`)
  );
};

/**
 * Single request-security hook for every Sent request, including the
 * generic API Request action. The connection's API key is attached only when
 * the effective destination is the official Sent v3 API, so a user-supplied
 * absolute endpoint can never receive the credential. A caller-supplied
 * `x-api-key` header is always replaced by the connection's own key.
 */
const addAuthHeader = ($, requestConfig) => {
  const url = getEffectiveUrl(requestConfig);

  if (!isSentApiUrl(url)) {
    throw new Error(
      `Sent connections can only send requests to ${SENT_API_ORIGIN}${SENT_API_PATH_PREFIX}/… endpoints.`
    );
  }

  const headers = AxiosHeaders.from(requestConfig.headers);
  headers.delete('x-api-key');

  if ($.auth.data?.apiKey) {
    headers.set('x-api-key', $.auth.data.apiKey);
  }

  requestConfig.headers = headers;

  return requestConfig;
};

export default addAuthHeader;
