import { CREATE_CREDENTIAL } from './create-credentials';
import { CREATE_AUTH_LINK } from './create-auth-link';
import { UPDATE_CREDENTIAL } from './update-credential';

type Mutations = {
  [key: string]: any,
}

const mutations: Mutations = {
  createCredential: CREATE_CREDENTIAL,
  updateCredential: UPDATE_CREDENTIAL,
  createAuthLink: CREATE_AUTH_LINK,
};

export default mutations;
