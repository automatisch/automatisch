import Typography from '@mui/material/Typography';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import CustomLogo from 'components/CustomLogo/index.ee';
import useConfig from 'hooks/useConfig';

const Logo = () => {
  const { config, loading } = useConfig(['logo.svgData']);

  const logoSvgData = config?.['logo.svgData'] as string;
  if (loading && !logoSvgData) return <React.Fragment />;

  if (logoSvgData) return <CustomLogo />;

  return (
    <Typography variant="h6" component="h1" data-test="typography-logo" noWrap>
      <FormattedMessage id="brandText" />
    </Typography>
  );
};

export default Logo;
