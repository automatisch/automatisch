export default async function getWebhooks($) {
  return await $.http.get('/v2/public/api/webhooks');
}
