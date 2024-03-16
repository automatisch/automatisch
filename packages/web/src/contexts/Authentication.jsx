import * as React from 'react';
import { getItem, setItem } from 'helpers/storage';

export const AuthenticationContext = React.createContext({
  token: null,
  updateToken: () => void 0,
  isAuthenticated: false,
  initialize: () => void 0,
});

export const AuthenticationProvider = (props) => {
  const { children } = props;
  const [isInitialized, setInitialized] = React.useState(false);
  const [token, setToken] = React.useState(() => getItem('token'));

  const value = React.useMemo(() => {
    return {
      token,
      updateToken: (newToken) => {
        setToken(newToken);
        setItem('token', newToken);
      },
      isAuthenticated: Boolean(token) && isInitialized,
      initialize: () => {
        setInitialized(true);
      },
    };
  }, [token, isInitialized]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
