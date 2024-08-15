import PropTypes from 'prop-types';
import * as React from 'react';
import { getItem, removeItem, setItem } from 'helpers/storage';
import api from 'helpers/api.js';

export const AuthenticationContext = React.createContext({
  token: null,
  updateToken: () => {},
  removeToken: () => {},
  isAuthenticated: false,
});

export const AuthenticationProvider = (props) => {
  const { children } = props;
  const [token, setToken] = React.useState(() => getItem('token'));

  const value = React.useMemo(() => {
    return {
      token,
      updateToken: (newToken) => {
        api.defaults.headers.Authorization = newToken;
        setToken(newToken);
        setItem('token', newToken);
      },
      removeToken: () => {
        delete api.defaults.headers.Authorization;
        setToken(null);
        removeItem('token');
      },
      isAuthenticated: Boolean(token),
    };
  }, [token]);

  return (
    <AuthenticationContext.Provider value={value}>
      {children}
    </AuthenticationContext.Provider>
  );
};

AuthenticationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
