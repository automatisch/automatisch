import Context from '../../types/express/context';
import SamlAuthProvider from '../../models/saml-auth-provider.ee';

const getSamlAuthProvider = async (
  _parent: unknown,
  params: unknown,
  context: Context
) => {
  context.currentUser.can('read', 'SamlAuthProvider');

  const samlAuthProvider = await SamlAuthProvider.query()
    .limit(1)
    .first()
    .throwIfNotFound();

  return samlAuthProvider;
};

export default getSamlAuthProvider;
