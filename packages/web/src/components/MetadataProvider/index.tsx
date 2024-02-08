import * as React from 'react';

import useConfig from 'hooks/useConfig';

type MetadataProviderProps = {
  children: React.ReactNode;
};

const MetadataProvider = ({
  children,
}: MetadataProviderProps): React.ReactElement => {
  const { config } = useConfig();

  React.useEffect(() => {
    document.title = (config?.title as string) || 'Automatisch';
  }, [config?.title]);

  React.useEffect(() => {
    const existingFaviconElement = document.querySelector(
      "link[rel~='icon']"
    ) as HTMLLinkElement | null;

    if (config?.disableFavicon === true) {
      existingFaviconElement?.remove();
    }

    if (config?.disableFavicon === false) {
      if (existingFaviconElement) {
        existingFaviconElement.href = '/browser-tab.ico';
      } else {
        const newFaviconElement = document.createElement('link');
        newFaviconElement.rel = 'icon';
        document.head.appendChild(newFaviconElement);
        newFaviconElement.href = '/browser-tab.ico';
      }
    }
  }, [config?.disableFavicon]);

  return <>{children}</>;
};

export default MetadataProvider;
