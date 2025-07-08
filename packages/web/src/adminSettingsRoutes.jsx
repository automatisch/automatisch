import { Navigate, Route } from 'react-router-dom';

import Can from 'components/Can';
import * as URLS from 'config/urls';
import AdminApiTokensPage from 'pages/AdminApiTokens/index.ee';
import AdminApplication from 'pages/AdminApplication/index.ee';
import AdminApplications from 'pages/AdminApplications/index.ee';
import AdminCreateTemplate from 'pages/AdminCreateTemplate/index.ee';
import AdminTemplates from 'pages/AdminTemplates/index.ee';
import AdminUpdateTemplate from 'pages/AdminUpdateTemplate/index.ee';
import Authentication from 'pages/Authentication/index.ee';
import CreateRole from 'pages/CreateRole/index.ee';
import CreateUser from 'pages/CreateUser';
import EditRole from 'pages/EditRole/index.ee';
import EditUser from 'pages/EditUser';
import Roles from 'pages/Roles/index.ee';
import UserInterface from 'pages/UserInterface/index.ee';
import Users from 'pages/Users';

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
        <Can I="manage" a="User">
          <CreateUser />
        </Can>
      }
    />

    <Route
      path={URLS.USER_PATTERN}
      element={
        <Can I="manage" a="User">
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
        <Can I="manage" a="Role">
          <CreateRole />
        </Can>
      }
    />

    <Route
      path={URLS.ROLE_PATTERN}
      element={
        <Can I="manage" a="Role">
          <EditRole />
        </Can>
      }
    />

    <Route
      path={URLS.USER_INTERFACE}
      element={
        <Can I="manage" a="Config">
          <UserInterface />
        </Can>
      }
    />

    <Route
      path={URLS.AUTHENTICATION}
      element={
        <Can I="read" a="SamlAuthProvider">
          <Can I="manage" a="SamlAuthProvider">
            <Authentication />
          </Can>
        </Can>
      }
    />

    <Route
      path={URLS.ADMIN_APPS}
      element={
        <Can I="manage" a="App">
          <AdminApplications />
        </Can>
      }
    />

    <Route
      path={`${URLS.ADMIN_APP_PATTERN}/*`}
      element={
        <Can I="manage" a="App">
          <AdminApplication />
        </Can>
      }
    />

    <Route
      path={`${URLS.ADMIN_TEMPLATES}/*`}
      element={
        <Can I="manage" a="Config">
          <AdminTemplates />
        </Can>
      }
    />

    <Route
      path={`${URLS.ADMIN_CREATE_TEMPLATE_PATTERN}/*`}
      element={
        <Can I="manage" a="Config">
          <AdminCreateTemplate />
        </Can>
      }
    />

    <Route
      path={`${URLS.ADMIN_UPDATE_TEMPLATE_PATTERN}/*`}
      element={
        <Can I="manage" a="Config">
          <AdminUpdateTemplate />
        </Can>
      }
    />

    <Route
      path={`${URLS.ADMIN_API_TOKENS}/*`}
      element={
        <Can I="manage" a="ApiToken">
          <AdminApiTokensPage />
        </Can>
      }
    />

    <Route
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
