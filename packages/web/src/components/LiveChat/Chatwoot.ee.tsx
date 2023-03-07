import * as React from 'react';

import appConfig from 'config/app';
import useCurrentUser from 'hooks/useCurrentUser';

type ChatwootProps = {
  ready: boolean;
}

const Chatwoot = ({ ready }: ChatwootProps) => {
  const currentUser = useCurrentUser();

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

    window.$chatwoot.toggleBubbleVisibility("show");
  }, [currentUser, ready]);

  return (
    <React.Fragment />
  );
};

export default Chatwoot;
