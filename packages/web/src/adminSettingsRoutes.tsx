import { Route, Navigate } from 'react-router-dom';
import AdminSettingsLayout from 'components/AdminSettingsLayout';
import Users from 'pages/Users';
import EditUser from 'pages/EditUser';
import CreateUser from 'pages/CreateUser';
import Roles from 'pages/Roles/index.ee';
import CreateRole from 'pages/CreateRole/index.ee';
import EditRole from 'pages/EditRole/index.ee';

import * as URLS from 'config/urls';

export default (
  <>
    <Route
      path={URLS.USERS}
      element={
        <AdminSettingsLayout>
          <Users />
        </AdminSettingsLayout>
      }
    />

    <Route
      path={URLS.CREATE_USER}
      element={
        <AdminSettingsLayout>
          <CreateUser />
        </AdminSettingsLayout>
      }
    />

    <Route
      path={URLS.USER_PATTERN}
      element={
        <AdminSettingsLayout>
          <EditUser />
        </AdminSettingsLayout>
      }
    />

    <Route
      path={URLS.ROLES}
      element={
        <AdminSettingsLayout>
          <Roles />
        </AdminSettingsLayout>
      }
    />

    <Route
      path={URLS.CREATE_ROLE}
      element={
        <AdminSettingsLayout>
          <CreateRole />
        </AdminSettingsLayout>
      }
    />

    <Route
      path={URLS.ROLE_PATTERN}
      element={
        <AdminSettingsLayout>
          <EditRole />
        </AdminSettingsLayout>
      }
    />

    <Route
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
