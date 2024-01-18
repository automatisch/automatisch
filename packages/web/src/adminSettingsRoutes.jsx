import { Route, Navigate } from 'react-router-dom';

import Users from 'pages/Users';
import EditUser from 'pages/EditUser';
import CreateUser from 'pages/CreateUser';
import Roles from 'pages/Roles/index.ee';
import CreateRole from 'pages/CreateRole/index.ee';
import EditRole from 'pages/EditRole/index.ee';
import Authentication from 'pages/Authentication';
import UserInterface from 'pages/UserInterface';
import * as URLS from 'config/urls';
import Can from 'components/Can';
import AdminApplications from 'pages/AdminApplications';
import AdminApplication from 'pages/AdminApplication';
// TODO: consider introducing redirections to `/` as fallback
export default (
  <>
    <Route
      path={URLS.USERS}
      element={
        <Can I="read" a="User">
          <Users />
        </Can>
      }
    />

    <Route
      path={URLS.CREATE_USER}
      element={
        <Can I="create" a="User">
          <CreateUser />
        </Can>
      }
    />

    <Route
      path={URLS.USER_PATTERN}
      element={
        <Can I="update" a="User">
          <EditUser />
        </Can>
      }
    />

    <Route
      path={URLS.ROLES}
      element={
        <Can I="read" a="Role">
          <Roles />
        </Can>
      }
    />

    <Route
      path={URLS.CREATE_ROLE}
      element={
        <Can I="create" a="Role">
          <CreateRole />
        </Can>
      }
    />

    <Route
      path={URLS.ROLE_PATTERN}
      element={
        <Can I="update" a="Role">
          <EditRole />
        </Can>
      }
    />

    <Route
      path={URLS.USER_INTERFACE}
      element={
        <Can I="update" a="Config">
          <UserInterface />
        </Can>
      }
    />

    <Route
      path={URLS.AUTHENTICATION}
      element={
        <Can I="read" a="SamlAuthProvider">
          <Can I="update" a="SamlAuthProvider">
            <Can I="create" a="SamlAuthProvider">
              <Authentication />
            </Can>
          </Can>
        </Can>
      }
    />

    <Route
      path={URLS.ADMIN_APPS}
      element={
        <Can I="update" a="App">
          <AdminApplications />
        </Can>
      }
    />

    <Route
      path={`${URLS.ADMIN_APP_PATTERN}/*`}
      element={
        <Can I="update" a="App">
          <AdminApplication />
        </Can>
      }
    />

    <Route
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
