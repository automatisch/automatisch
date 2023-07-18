import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import PublicLayout from 'components/PublicLayout';
import Applications from 'pages/Applications';
import Application from 'pages/Application';
import Executions from 'pages/Executions';
import Execution from 'pages/Execution';
import Flows from 'pages/Flows';
import Flow from 'pages/Flow';
import Login from 'pages/Login';
import LoginCallback from 'pages/LoginCallback';
import SignUp from 'pages/SignUp/index.ee';
import ForgotPassword from 'pages/ForgotPassword/index.ee';
import ResetPassword from 'pages/ResetPassword/index.ee';
import EditorRoutes from 'pages/Editor/routes';
import * as URLS from 'config/urls';
import settingsRoutes from './settingsRoutes';
import adminSettingsRoutes from './adminSettingsRoutes';
import Notifications from 'pages/Notifications';

export default (
  <Routes>
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

    <Route
      path={URLS.LOGIN_CALLBACK}
      element={<LoginCallback />}
    />

    <Route
      path={URLS.SIGNUP}
      element={
        <PublicLayout>
          <SignUp />
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

    <Route
      path={URLS.UPDATES}
      element={
        <Layout>
          <Notifications />
        </Layout>
      }
    />

    <Route path="/" element={<Navigate to={URLS.FLOWS} replace />} />

    <Route path={URLS.SETTINGS}>{settingsRoutes}</Route>

    <Route path={URLS.ADMIN_SETTINGS}>{adminSettingsRoutes}</Route>

    <Route
      element={
        <Layout>
          <div>404</div>
        </Layout>
      }
    />
  </Routes>
);
