import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import appConfig from 'config/app';
import useCurrentUser from 'hooks/useCurrentUser';

type ChatwootProps = {
  ready: boolean;
}

const Chatwoot = ({ ready }: ChatwootProps) => {
  const theme = useTheme();
  const currentUser = useCurrentUser();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));

  React.useEffect(function initiateChatwoot() {
    window.chatwootSDK.run({
      websiteToken: 'EFyq5MTsvS7XwUrwSH36VskT',
      baseUrl: appConfig.chatwootBaseUrl,
    });

    return function removeChatwoot() {
      window.$chatwoot.reset();
      window.$chatwoot.toggleBubbleVisibility('hide');
    };
  }, []);

  React.useEffect(function initiateUser() {
    if (!currentUser?.id || !ready) return;

    window.$chatwoot.setUser(currentUser.id, {
      email: currentUser.email,
      name: currentUser.fullName,
    });

    if (!matchSmallScreens) {
      window.$chatwoot.toggleBubbleVisibility("show");
    }
  }, [currentUser, ready, matchSmallScreens]);

  React.useLayoutEffect(function hideChatwoot() {
    if (matchSmallScreens) {
      window.$chatwoot?.toggleBubbleVisibility('hide');
    } else {
      window.$chatwoot?.toggleBubbleVisibility('show');
    }
  }, [matchSmallScreens])

  return (
    <React.Fragment />
  );
};

export default Chatwoot;
