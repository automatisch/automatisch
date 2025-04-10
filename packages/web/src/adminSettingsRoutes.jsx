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
import AdminTemplates from 'pages/AdminTemplates';
import AdminCreateTemplate from 'pages/AdminCreateTemplate';
import AdminUpdateTemplate from 'pages/AdminUpdateTemplate';

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
            <Can I="manage" a="SamlAuthProvider">
              <Authentication />
            </Can>
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
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
