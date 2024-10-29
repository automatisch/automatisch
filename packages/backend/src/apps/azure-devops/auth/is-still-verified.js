import getCurrentUser from '../common/get-current-user.js';

export default async function ($) {
  const user = await getCurrentUser($);
  return !!user;
}
