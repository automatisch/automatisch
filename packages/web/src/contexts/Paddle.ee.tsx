import * as React from 'react';

import useCloud from 'hooks/useCloud';
import usePaddleInfo from 'hooks/usePaddleInfo.ee';

declare global {
  interface Window {
    Paddle: any;
  }
}

export type PaddleContextParams = {
  loaded: boolean;
};

export const PaddleContext =
  React.createContext<PaddleContextParams>({
    loaded: false,
  });

type PaddleProviderProps = {
  children: React.ReactNode;
};

export const PaddleProvider = (
  props: PaddleProviderProps
): React.ReactElement => {
  const { children } = props;
  const isCloud = useCloud();
  const { sandbox, vendorId } = usePaddleInfo();
  const [loaded, setLoaded] = React.useState(false);

  const value = React.useMemo(() => {
    return {
      loaded,
    };
  }, [loaded]);

  React.useEffect(function loadPaddleScript() {
    if (!isCloud) return;

    const isInjected = document.getElementById('paddle-js');

    if (isInjected) {
      setLoaded(true);
      return;
    }

    const g = document.createElement('script')
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
    }
  }, [isCloud]);

  React.useEffect(function initPaddleScript() {
    if (!loaded || !vendorId) return;

    if (sandbox) {
      window.Paddle.Environment.set('sandbox');
    }

    window.Paddle.Setup({ vendor: vendorId });
  }, [loaded, sandbox, vendorId])

  return (
    <PaddleContext.Provider value={value}>
      {children}
    </PaddleContext.Provider>
  );
};
