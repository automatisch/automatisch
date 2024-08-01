import { useEffect } from 'react';
import {
  Route,
  Routes as ReactRouterRoutes,
  Navigate,
  useNavigate,
} from 'react-router-dom';

import Layout from 'components/Layout';
import NoResultFound from 'components/NotFound';
import PublicLayout from 'components/PublicLayout';
import AdminSettingsLayout from 'components/AdminSettingsLayout';
import Applications from 'pages/Applications';
import Application from 'pages/Application';
import Executions from 'pages/Executions';
import Execution from 'pages/Execution';
import Flows from 'pages/Flows';
import Flow from 'pages/Flow';
import Login from 'pages/Login';
import AcceptInvitation from 'pages/AcceptInvitation';
import LoginCallback from 'pages/LoginCallback';
import SignUp from 'pages/SignUp/index.ee';
import ForgotPassword from 'pages/ForgotPassword/index.ee';
import ResetPassword from 'pages/ResetPassword/index.ee';
import EditorRoutes from 'pages/Editor/routes';
import * as URLS from 'config/urls';
import settingsRoutes from './settingsRoutes';
import adminSettingsRoutes from './adminSettingsRoutes';
import Notifications from 'pages/Notifications';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useAuthentication from 'hooks/useAuthentication';
import useAutomatischInfo from 'hooks/useAutomatischInfo';
import Installation from 'pages/Installation';

function Routes() {
  const { data: automatischInfo, isSuccess } = useAutomatischInfo();
  const { data: configData } = useAutomatischConfig();
  const { isAuthenticated } = useAuthentication();
  const config = configData?.data;

  const installed = isSuccess ? automatischInfo.data.installationCompleted : true;
  const navigate = useNavigate();

  useEffect(() => {
    if (!installed) {
      navigate(URLS.INSTALLATION, { replace: true });
    }
  }, []);

  return (
    <ReactRouterRoutes>
      <Route
        path={URLS.EXECUTIONS}
        element={
          <Layout>
            <Executions />
          </Layout>
        }
      />

      <Route
        path={URLS.EXECUTION_PATTERN}
        element={
          <Layout>
            <Execution />
          </Layout>
        }
      />

      <Route
        path={URLS.FLOWS}
        element={
          <Layout>
            <Flows />
          </Layout>
        }
      />

      <Route
        path={URLS.FLOW_PATTERN}
        element={
          <Layout>
            <Flow />
          </Layout>
        }
      />

      <Route
        path={`${URLS.APPS}/*`}
        element={
          <Layout>
            <Applications />
          </Layout>
        }
      />

      <Route
        path={`${URLS.APP_PATTERN}/*`}
        element={
          <Layout>
            <Application />
          </Layout>
        }
      />

      <Route path={`${URLS.EDITOR}/*`} element={<EditorRoutes />} />

      <Route
        path={URLS.LOGIN}
        element={
          <PublicLayout>
            <Login />
          </PublicLayout>
        }
      />

      <Route path={URLS.LOGIN_CALLBACK} element={<LoginCallback />} />

      <Route
        path={URLS.SIGNUP}
        element={
          <PublicLayout>
            <SignUp />
          </PublicLayout>
        }
      />

      <Route
        path={URLS.ACCEPT_INVITATON}
        element={
          <PublicLayout>
            <AcceptInvitation />
          </PublicLayout>
        }
      />

      <Route
        path={URLS.FORGOT_PASSWORD}
        element={
          <PublicLayout>
            <ForgotPassword />
          </PublicLayout>
        }
      />

      <Route
        path={URLS.RESET_PASSWORD}
        element={
          <PublicLayout>
            <ResetPassword />
          </PublicLayout>
        }
      />

      {!installed && (
        <Route
          path={URLS.INSTALLATION}
          element={
            <PublicLayout>
              <Installation />
            </PublicLayout>
          }
        />
      )}

      {!config?.disableNotificationsPage && (
        <Route
          path={URLS.UPDATES}
          element={
            <Layout>
              <Notifications />
            </Layout>
          }
        />
      )}

      <Route
        path="/"
        element={
          <Navigate to={isAuthenticated ? URLS.FLOWS : URLS.LOGIN} replace />
        }
      />

      <Route path={URLS.SETTINGS}>{settingsRoutes}</Route>

      <Route path={URLS.ADMIN_SETTINGS} element={<AdminSettingsLayout />}>
        {adminSettingsRoutes}
      </Route>
      <Route path="*" element={<NoResultFound />} />
    </ReactRouterRoutes>
  );
}

export default <Routes />;
