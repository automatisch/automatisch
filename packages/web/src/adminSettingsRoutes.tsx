import { Route, Navigate } from 'react-router-dom';
import AdminSettingsLayout from 'components/AdminSettingsLayout';
import Users from 'pages/Users';
import EditUser from 'pages/EditUser';
import CreateUser from 'pages/CreateUser';
import Roles from 'pages/Roles/index.ee';
import CreateRole from 'pages/CreateRole/index.ee';
import EditRole from 'pages/EditRole/index.ee';
import UserInterface from 'pages/UserInterface';

import * as URLS from 'config/urls';
import Can from 'components/Can';

// TODO: consider introducing redirections to `/` as fallback
export default (
  <>
    <Route
      path={URLS.USERS}
      element={
        <Can I="read" a="User">
          <AdminSettingsLayout>
            <Users />
          </AdminSettingsLayout>
        </Can>
      }
    />

    <Route
      path={URLS.CREATE_USER}
      element={
        <Can I="create" a="User">
          <AdminSettingsLayout>
            <CreateUser />
          </AdminSettingsLayout>
        </Can>
      }
    />

    <Route
      path={URLS.USER_PATTERN}
      element={
        <Can I="update" a="User">
          <AdminSettingsLayout>
            <EditUser />
          </AdminSettingsLayout>
        </Can>
      }
    />

    <Route
      path={URLS.ROLES}
      element={
        <Can I="read" a="Role">
          <AdminSettingsLayout>
            <Roles />
          </AdminSettingsLayout>
        </Can>
      }
    />

    <Route
      path={URLS.CREATE_ROLE}
      element={
        <Can I="create" a="Role">
          <AdminSettingsLayout>
            <CreateRole />
          </AdminSettingsLayout>
        </Can>
      }
    />

    <Route
      path={URLS.ROLE_PATTERN}
      element={
        <Can I="update" a="Role">
          <AdminSettingsLayout>
            <EditRole />
          </AdminSettingsLayout>
        </Can>
      }
    />

    <Route
      path={URLS.USER_INTERFACE}
      element={
        <Can I="update" a="Config">
          <AdminSettingsLayout>
            <UserInterface />
          </AdminSettingsLayout>
        </Can>
      }
    />

    <Route
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
