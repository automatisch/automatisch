import PropTypes from 'prop-types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import * as URLS from 'config/urls';
import useCloud from 'hooks/useCloud';
import usePaddleInfo from 'hooks/usePaddleInfo.ee';
import { useQueryClient } from '@tanstack/react-query';

export const PaddleContext = React.createContext({
  loaded: false,
});

export const PaddleProvider = (props) => {
  const { children } = props;
  const isCloud = useCloud();
  const navigate = useNavigate();
  const { data } = usePaddleInfo();
  const sandbox = data?.data?.sandbox;
  const vendorId = data?.data?.vendorId;
  const queryClient = useQueryClient();

  const [loaded, setLoaded] = React.useState(false);

  const paddleEventHandler = React.useCallback(
    async (payload) => {
      const { event, eventData } = payload;

      if (event === 'Checkout.Close') {
        const completed = eventData.checkout?.completed;
        if (completed) {
          // Paddle has side effects in the background,
          // so we need to refetch the relevant queries
          await queryClient.refetchQueries({
            queryKey: ['users', 'me', 'trial'],
          });

          await queryClient.refetchQueries({
            queryKey: ['users', 'me', 'subscription'],
          });

          navigate(URLS.SETTINGS_BILLING_AND_USAGE, {
            state: { checkoutCompleted: true },
          });
        }
      }
    },
    [navigate, queryClient],
  );

  const value = React.useMemo(() => {
    return {
      loaded,
    };
  }, [loaded]);

  React.useEffect(
    function loadPaddleScript() {
      if (!isCloud) return;
      const isInjected = document.getElementById('paddle-js');

      if (isInjected) {
        setLoaded(true);
        return;
      }
      const g = document.createElement('script');
      const s = document.getElementsByTagName('script')[0];
      g.src = 'https://cdn.paddle.com/paddle/paddle.js';
      g.defer = true;
      g.async = true;
      g.id = 'paddle-js';

      if (s.parentNode) {
        s.parentNode.insertBefore(g, s);
      }

      g.onload = function () {
        setLoaded(true);
      };
    },
    [isCloud],
  );

  React.useEffect(
    function initPaddleScript() {
      if (!loaded || !vendorId) return;

      if (sandbox) {
        window.Paddle.Environment.set('sandbox');
      }

      window.Paddle.Setup({
        vendor: vendorId,
        eventCallback: paddleEventHandler,
      });
    },
    [loaded, sandbox, vendorId, paddleEventHandler],
  );

  return (
    <PaddleContext.Provider value={value}>{children}</PaddleContext.Provider>
  );
};

PaddleProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
