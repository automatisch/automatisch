import Typography from '@mui/material/Typography';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import MationLogo from 'components/MationLogo';
import useAutomatischInfo from 'hooks/useAutomatischInfo';

const DefaultLogo = () => {
  const { isMation, loading } = useAutomatischInfo();

  if (loading) return <React.Fragment />;

  if (isMation) return <MationLogo />;

  return (
    <Typography variant="h6" component="h1" data-test="typography-logo" noWrap>
      <FormattedMessage id="brandText" />
    </Typography>
  );
};

export default DefaultLogo;
