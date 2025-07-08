import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { Link } from 'react-router-dom';

import * as URLS from 'config/urls';
import useAuthentication from 'hooks/useAuthentication';
import useFormatMessage from 'hooks/useFormatMessage';
import useRevokeAccessToken from 'hooks/useRevokeAccessToken';
import useIsCurrentUserAdmin from 'hooks/useIsCurrentUserAdmin';

function AccountDropdownMenu(props) {
  const formatMessage = useFormatMessage();
  const authentication = useAuthentication();
  const token = authentication.token;
  const navigate = useNavigate();
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const revokeAccessTokenMutation = useRevokeAccessToken(token);
  const { open, onClose, anchorEl, id } = props;

  const logout = async () => {
    await revokeAccessTokenMutation.mutateAsync();

    authentication.removeToken();
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
      <MenuItem component={Link} to={URLS.SETTINGS_DASHBOARD} onClick={onClose}>
        {formatMessage('accountDropdownMenu.settings')}
      </MenuItem>

      {isCurrentUserAdmin === true && (
        <MenuItem
          component={Link}
          to={URLS.ADMIN_SETTINGS_DASHBOARD}
          onClick={onClose}
        >
          {formatMessage('accountDropdownMenu.adminSettings')}
        </MenuItem>
      )}

      <MenuItem onClick={logout} data-test="logout-item">
        {formatMessage('accountDropdownMenu.logout')}
      </MenuItem>
    </Menu>
  );
}

AccountDropdownMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorEl: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(window.Element) }),
  ]),
  id: PropTypes.string.isRequired,
};

export default AccountDropdownMenu;
