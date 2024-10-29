export default async function ($) {
  const { data } = await $.http.get('/_apis/ConnectionData');

  return data?.authenticatedUser;
}
