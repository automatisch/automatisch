import { URL, URLSearchParams } from 'node:url';
import { IGlobalVariable } from '@automatisch/types';

import appConfig from '../../../config/app';
import getInstanceUrl from '../common/get-instance-url';

export default async function generateAuthUrl($: IGlobalVariable) {
  const successUrl = new URL(
    '/app/wordpress/connections/add',
    appConfig.webAppUrl
  ).toString();
  const baseUrl = getInstanceUrl($);

  const searchParams = new URLSearchParams({
    app_name: 'automatisch',
    success_url: successUrl,
  });

  const url = new URL(`/wp-admin/authorize-application.php?${searchParams}`, baseUrl).toString();

  await $.auth.set({
    url,
  });
}
