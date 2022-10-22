import { IGlobalVariable } from '@automatisch/types';

const isStillVerified = async ($: IGlobalVariable) => {
  try {
    const params = {
      method: 'flickr.test.login',
      format: 'json',
      nojsoncallback: 1,
    }
    const response = await $.http.get('/rest', { params });
    return !!response.data.user.id;
  } catch (error) {
    return false;
  }
};

export default isStillVerified;
