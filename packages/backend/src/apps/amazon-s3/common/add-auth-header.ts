import { IJSONObject, TBeforeRequest } from '@automatisch/types';
import crypto from 'crypto';
import { getISODate, getYYYYMMDD } from './get-current-date';

function hmac(key: string | Buffer, data: string) {
  return crypto.createHmac('sha256', key).update(data).digest('hex');
}

function hmacWoHex(key: Buffer | string, data: string) {
  return crypto.createHmac('sha256', key).update(data).digest();
}

function hash(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

function prepareCanonicalRequest(
  method: string,
  path: string,
  queryParams: IJSONObject | string,
  headers: IJSONObject,
  payload: string
) {
  const canonicalRequest = [method, encodeURIComponent(path)];

  // Step 3: Canonical Query String
  if (typeof queryParams === 'string') {
    canonicalRequest.push('');
  } else {
    const sortedQueryParams = Object.keys(queryParams)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(
            queryParams[key] as string
          )}`
      )
      .sort();
    canonicalRequest.push(sortedQueryParams.join('&'));
  }

  // Step 4: Canonical Headers
  const sortedHeaders = Object.keys(headers)
    .sort()
    .map((key) => `${key.toLowerCase()}:${(headers[key] as string).trim()}`);

  canonicalRequest.push(sortedHeaders.join('\n'));

  // Step 5: Signed Headers
  const signedHeaders = Object.keys(headers)
    .sort()
    .map((key) => key.toLowerCase())
    .join(';');
  canonicalRequest.push(signedHeaders);

  const hashedPayload = hash(payload);
  canonicalRequest.push(hashedPayload);

  return canonicalRequest.join('\n');
}

function prepareStringToSign(
  datetime: string,
  credentialScope: string,
  hashedCanonicalRequest: string
) {
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    datetime,
    credentialScope,
    hashedCanonicalRequest,
  ];

  return stringToSign.join('\n');
}

function calculateSigningKey(
  secretKey: string,
  date: string,
  region: string,
  service: string
) {
  const dateKey = hmacWoHex('AWS4' + secretKey, date);
  const dateRegionKey = hmacWoHex(dateKey, region);
  const dateRegionServiceKey = hmacWoHex(dateRegionKey, service);
  const signingKey = hmacWoHex(dateRegionServiceKey, 'aws4_request');
  return signingKey;
}

function createAuthorizationHeader(
  accessKey: string,
  credentialScope: string,
  signedHeaders: string,
  signature: string
) {
  return `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
}

const addAuthHeader: TBeforeRequest = ($, requestConfig) => {
  const accessKeyId = $.auth.data.accessKeyId as string;
  const secretAccessKey = $.auth.data.secretAccessKey as string;
  const date = getYYYYMMDD();
  const formattedDate = getISODate();
  const region = 'us-east-1';
  const method = 'GET';
  const path = '/';
  const queryParams = '';
  const payload = '';
  const headers = {
    Host: 's3.amazonaws.com',
    'X-Amz-Content-Sha256': hash(payload),
    'X-Amz-Date': formattedDate,
  };
  const headerKeys = Object.keys(headers)
    .sort()
    .map((header) => header.toLowerCase())
    .join(';');

  const canonicalRequest = prepareCanonicalRequest(
    method,
    path,
    queryParams,
    headers,
    payload
  );

  const stringToSign = prepareStringToSign(
    formattedDate,
    `${date}/${region}/s3/aws4_request`,
    hash(canonicalRequest)
  );

  const signingKey = calculateSigningKey(secretAccessKey, date, region, 's3');

  const signature = hmac(signingKey, stringToSign);

  const authorizationHeader = createAuthorizationHeader(
    accessKeyId,
    `${date}/${region}/s3/aws4_request`,
    headerKeys,
    signature
  );

  if ($.auth.data?.secretAccessKey && $.auth.data?.accessKeyId) {
    requestConfig.headers.Authorization = authorizationHeader;
    requestConfig.headers['Host'] = 's3.amazonaws.com';
    requestConfig.headers['X-Amz-Content-Sha256'] = hash(payload);
    requestConfig.headers['X-Amz-Date'] = formattedDate;
  }

  return requestConfig;
};

export default addAuthHeader;
