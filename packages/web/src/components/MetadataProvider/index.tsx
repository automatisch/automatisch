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

  return <>{children}</>;
};

export default MetadataProvider;
