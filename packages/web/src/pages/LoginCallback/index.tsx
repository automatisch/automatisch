import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import useAuthentication from 'hooks/useAuthentication';
import * as URLS from 'config/urls';

export default function LoginCallback(): React.ReactElement {
  const navigate = useNavigate();
  const authentication = useAuthentication();
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    if (authentication.isAuthenticated) {
      navigate(URLS.DASHBOARD);
    }
  }, [authentication.isAuthenticated]);

  React.useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      authentication.updateToken(token);
    }

    // TODO: handle non-existing token scenario
  }, []);

  return (<></>);
}
