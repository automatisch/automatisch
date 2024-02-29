import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import Badge from '@mui/material/Badge';
import ListItemLink from 'components/ListItemLink';
import useFormatMessage from 'hooks/useFormatMessage';
import { Drawer as BaseDrawer } from './style';

const iOS =
  typeof navigator !== 'undefined' &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

function Drawer(props) {
  const { links = [], bottomLinks = [], ...drawerProps } = props;
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const formatMessage = useFormatMessage();
  const closeOnClick = (event) => {
    if (matchSmallScreens) {
      props.onClose(event);
    }
  };
  return (
    <BaseDrawer
      {...drawerProps}
      disableBackdropTransition={!iOS}
      disableDiscovery={iOS}
      variant={matchSmallScreens ? 'temporary' : 'permanent'}
    >
      {/* keep the following encapsulating `div` to have `space-between` children  */}
      <div>
        <Toolbar />

        <List sx={{ py: 0, mt: 3 }}>
          {links.map(({ Icon, primary, to, dataTest }, index) => (
            <ListItemLink
              key={`${to}-${index}`}
              icon={<Icon htmlColor={theme.palette.primary.main} />}
              primary={formatMessage(primary)}
              to={to}
              onClick={closeOnClick}
              data-test={dataTest}
            />
          ))}
        </List>

        <Divider />
      </div>

      <List sx={{ py: 0, mt: 3 }}>
        {bottomLinks.map(
          ({ Icon, badgeContent, primary, to, dataTest, target }, index) => (
            <ListItemLink
              key={`${to}-${index}`}
              icon={
                <Badge badgeContent={badgeContent} color="secondary" max={99}>
                  <Icon htmlColor={theme.palette.primary.main} />
                </Badge>
              }
              primary={primary}
              to={to}
              onClick={closeOnClick}
              target={target}
              data-test={dataTest}
            />
          ),
        )}
      </List>
    </BaseDrawer>
  );
}

const DrawerLinkPropTypes = PropTypes.shape({
  Icon: PropTypes.elementType.isRequired,
  primary: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  target: PropTypes.oneOf(['_blank']),
  badgeContent: PropTypes.node,
  dataTest: PropTypes.string,
});

Drawer.propTypes = {
  links: PropTypes.arrayOf(DrawerLinkPropTypes).isRequired,
  bottomLinks: PropTypes.arrayOf(DrawerLinkPropTypes),
  onClose: PropTypes.func.isRequired,
};

export default Drawer;
