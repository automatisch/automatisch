import * as React from 'react';
import CustomLogo from 'components/CustomLogo/index.ee';
import DefaultLogo from 'components/DefaultLogo';
import useConfig from 'hooks/useConfig';
const Logo = () => {
  const { config, loading } = useConfig(['logo.svgData']);
  const logoSvgData = config?.['logo.svgData'];
  if (loading && !logoSvgData) return <React.Fragment />;
  if (logoSvgData) return <CustomLogo />;
  return <DefaultLogo />;
};
export default Logo;
