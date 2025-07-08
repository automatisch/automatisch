import { Navigate, Route } from 'react-router-dom';

import EnterpriseAdminGuard from 'components/EnterpriseAdminGuard/index.ee';
import AdminGuard from 'components/AdminGuard';
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
        <AdminGuard>
          <Users />
        </AdminGuard>
      }
    />

    <Route
      path={URLS.CREATE_USER}
      element={
        <AdminGuard>
          <CreateUser />
        </AdminGuard>
      }
    />

    <Route
      path={URLS.USER_PATTERN}
      element={
        <AdminGuard>
          <EditUser />
        </AdminGuard>
      }
    />

    <Route
      path={URLS.ROLES}
      element={
        <EnterpriseAdminGuard>
          <Roles />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.CREATE_ROLE}
      element={
        <EnterpriseAdminGuard>
          <CreateRole />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ROLE_PATTERN}
      element={
        <EnterpriseAdminGuard>
          <EditRole />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.USER_INTERFACE}
      element={
        <EnterpriseAdminGuard>
          <UserInterface />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.AUTHENTICATION}
      element={
        <EnterpriseAdminGuard>
          <Authentication />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_APPS}
      element={
        <EnterpriseAdminGuard>
          <AdminApplications />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={`${URLS.ADMIN_APP_PATTERN}/*`}
      element={
        <EnterpriseAdminGuard>
          <AdminApplication />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={`${URLS.ADMIN_TEMPLATES}/*`}
      element={
        <EnterpriseAdminGuard>
          <AdminTemplates />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={`${URLS.ADMIN_CREATE_TEMPLATE_PATTERN}/*`}
      element={
        <EnterpriseAdminGuard>
          <AdminCreateTemplate />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={`${URLS.ADMIN_UPDATE_TEMPLATE_PATTERN}/*`}
      element={
        <EnterpriseAdminGuard>
          <AdminUpdateTemplate />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={`${URLS.ADMIN_API_TOKENS}/*`}
      element={
        <EnterpriseAdminGuard>
          <AdminApiTokensPage />
        </EnterpriseAdminGuard>
      }
    />

    <Route
      path={URLS.ADMIN_SETTINGS}
      element={<Navigate to={URLS.USERS} replace />}
    />
  </>
);
