import { URL, URLSearchParams } from 'node:url';

import appConfig from '../../../config/app.js';
import getInstanceUrl from '../common/get-instance-url.js';

export default async function generateAuthUrl($) {
  const successUrl = new URL(
    '/app/wordpress/connections/add',
    appConfig.webAppUrl
  ).toString();
  const baseUrl = getInstanceUrl($);

  const searchParams = new URLSearchParams({
    app_name: 'automatisch',
    success_url: successUrl,
  });

  const url = new URL(
    `/wp-admin/authorize-application.php?${searchParams}`,
    baseUrl
  ).toString();

  await $.auth.set({
    url,
  });
}
