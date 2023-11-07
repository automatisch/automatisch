import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  const site = await $.http.get('/admin/site/');
  const screenName = [site.data.site.title, site.data.site.url]
    .filter(Boolean)
    .join(' @ ');

  await $.auth.set({
    screenName,
  });

  await $.http.get('/admin/pages/');
};

export default verifyCredentials;
