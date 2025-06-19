import * as React from 'react';
import PropTypes from 'prop-types';

import useAutomatischConfig from 'hooks/useAutomatischConfig';

const MetadataProvider = ({ children }) => {
  const { data: configData } = useAutomatischConfig();
  const config = configData?.data;

  React.useEffect(() => {
    document.title = config?.title || 'Automatisch';
  }, [config?.title]);

  React.useEffect(() => {
    const existingFaviconElement = document.querySelector("link[rel~='icon']");

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

MetadataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default MetadataProvider;
