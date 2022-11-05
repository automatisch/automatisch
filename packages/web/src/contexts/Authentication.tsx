import * as React from 'react';
import { getItem, setItem } from 'helpers/storage';

export type AuthenticationContextParams = {
  token: string | null;
  updateToken: (token: string) => void;
};

export const AuthenticationContext =
  React.createContext<AuthenticationContextParams>({
    token: null,
    updateToken: () => void 0,
  });

type AuthenticationProviderProps = {
  children: React.ReactNode;
};

export const AuthenticationProvider = (
  props: AuthenticationProviderProps
): React.ReactElement => {
  const { children } = props;
  const [token, setToken] = React.useState(() => getItem('token'));

  const value = React.useMemo(() => {
    return {
      token,
      updateToken: (newToken: string) => {
        setToken(newToken);
        setItem('token', newToken);
      },
    };
  }, [token]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};
