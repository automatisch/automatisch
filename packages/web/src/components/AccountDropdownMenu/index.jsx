import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import Menu, { MenuProps } from '@mui/material/Menu';
import { Link } from 'react-router-dom';

import apolloClient from 'graphql/client';
import * as URLS from 'config/urls';
import useAuthentication from 'hooks/useAuthentication';
import useFormatMessage from 'hooks/useFormatMessage';

type AccountDropdownMenuProps = {
  open: boolean;
  onClose: () => void;
  anchorEl: MenuProps['anchorEl'];
  id: string;
};

function AccountDropdownMenu(
  props: AccountDropdownMenuProps
): React.ReactElement {
  const formatMessage = useFormatMessage();
  const authentication = useAuthentication();
  const navigate = useNavigate();

  const { open, onClose, anchorEl, id } = props;

  const logout = async () => {
    authentication.updateToken('');
    await apolloClient.clearStore();

    onClose();

    navigate(URLS.LOGIN);
  };

  return (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      id={id}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={onClose}
    >
      <MenuItem component={Link} to={URLS.SETTINGS_DASHBOARD}>
        {formatMessage('accountDropdownMenu.settings')}
      </MenuItem>

      <MenuItem component={Link} to={URLS.ADMIN_SETTINGS_DASHBOARD}>
        {formatMessage('accountDropdownMenu.adminSettings')}
      </MenuItem>

      <MenuItem onClick={logout} data-test="logout-item">
        {formatMessage('accountDropdownMenu.logout')}
      </MenuItem>
    </Menu>
  );
}

export default AccountDropdownMenu;
