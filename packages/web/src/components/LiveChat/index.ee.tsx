import * as React from 'react';

import appConfig from 'config/app';
import useAuthentication from 'hooks/useAuthentication';
import useCloud from 'hooks/useCloud';
import Chatwoot from './Chatwoot.ee';

declare global {
  interface Window {
    chatwootSDK: any;
    $chatwoot: any;
    chatwootSettings: Record<string, unknown>;
  }
}

const LiveChat = () => {
  const isCloud = useCloud();
  const { isAuthenticated } = useAuthentication();
  const [isLoaded, setLoaded] = React.useState(false);
  const [isReady, setReady] = React.useState(false);

  const shouldShow = isCloud && isAuthenticated;

  React.useLayoutEffect(() => {
    window.addEventListener("chatwoot:ready", function () {
      setReady(true);
    }, { once: true });
  }, []);

  React.useLayoutEffect(function addChatwootScript() {
    if (!shouldShow) return;

    window.chatwootSettings = {
      hideMessageBubble: true,
      position: 'right',
      type: 'standard',
      launcherTitle: 'Give us feedback'
    };

    const g = document.createElement('script')
    const s = document.getElementsByTagName('script')[0];
    g.src = appConfig.chatwootBaseUrl + '/packs/js/sdk.js';
    g.defer = true;
    g.async = true;

    if (s.parentNode) {
      s.parentNode.insertBefore(g, s);
    }

    g.onload = function () {
      setLoaded(true);
    }
  }, [shouldShow]);

  if (!shouldShow || !isLoaded) return (<React.Fragment />);

  return (
    <Chatwoot ready={isReady} />
  );
};

export default LiveChat;
