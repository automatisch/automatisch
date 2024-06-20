import * as React from 'react';

import CustomLogo from 'components/CustomLogo/index.ee';
import DefaultLogo from 'components/DefaultLogo';
import useAutomatischConfig from 'hooks/useAutomatischConfig';

const Logo = () => {
  const { data: configData, isLoading } = useAutomatischConfig();
  const config = configData?.data;
  const logoSvgData = config?.['logo.svgData'];

  if (isLoading && !logoSvgData) return <React.Fragment />;

  if (logoSvgData) return <CustomLogo />;

  return <DefaultLogo />;
};

export default Logo;
