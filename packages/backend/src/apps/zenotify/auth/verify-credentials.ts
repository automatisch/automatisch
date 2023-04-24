import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
    await $.http.get('');

    await $.auth.set({
      screenName: $.auth.data.screenName,
    });};

export default verifyCredentials;
