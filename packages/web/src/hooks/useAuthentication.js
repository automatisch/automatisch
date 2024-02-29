import * as React from 'react';
import { AuthenticationContext } from 'contexts/Authentication';

export default function useAuthentication() {
  const authenticationContext = React.useContext(AuthenticationContext);

  return {
    token: authenticationContext.token,
    updateToken: authenticationContext.updateToken,
    isAuthenticated: Boolean(authenticationContext.token),
  };
}
