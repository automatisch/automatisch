const setBaseUrl = ($, requestConfig) => {
  const realtimeDatabaseId = $.auth.data.realtimeDatabaseId;

  if (requestConfig.additionalProperties?.skipAddingAuthHeader)
    return requestConfig;

  if (requestConfig.additionalProperties?.setFirestoreBaseUrl) {
    requestConfig.baseURL = 'https://firestore.googleapis.com';
  } else {
    requestConfig.baseURL = `https://${realtimeDatabaseId}.firebaseio.com`;
  }

  return requestConfig;
};

export default setBaseUrl;
