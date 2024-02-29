import Typography from '@mui/material/Typography';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import MationLogo from 'components/MationLogo';
import useAutomatischInfo from 'hooks/useAutomatischInfo';

export default function DefaultLogo() {
  const { data: automatischInfo, isPending } = useAutomatischInfo();
  const isMation = automatischInfo?.data.isMation;

  if (isPending) return <React.Fragment />;
  if (isMation) return <MationLogo />;

  return (
    <Typography variant="h6" component="h1" data-test="typography-logo" noWrap>
      <FormattedMessage id="brandText" />
    </Typography>
  );
}
