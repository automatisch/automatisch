import type { IGlobalVariable } from "@automatisch/types";

export default async function getWebhooks($: IGlobalVariable) {
  return await $.http.get('/v2/public/api/webhooks');
}
