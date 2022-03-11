import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import PublicLayout from 'components/PublicLayout';
import Applications from 'pages/Applications';
import Application from 'pages/Application';
import Flows from 'pages/Flows';
import Executions from 'pages/Executions';
import Flow from 'pages/Flow';
import Explore from 'pages/Explore';
import Login from 'pages/Login';
import EditorRoutes from 'pages/Editor/routes';
import * as URLS from 'config/urls';

export default (
  <Routes>
    <Route path={URLS.EXECUTIONS} element={<Layout><Executions /></Layout>} />

    <Route path={URLS.FLOWS} element={<Layout><Flows /></Layout>} />

    <Route path={`${URLS.FLOW_PATTERN}/*`} element={<Layout><Flow /></Layout>} />

    <Route path={`${URLS.APPS}/*`} element={<Layout><Applications /></Layout>} />

    <Route path={URLS.EXPLORE} element={<Layout><Explore /></Layout>} />

    <Route path={`${URLS.APP_PATTERN}/*`} element={<Layout><Application /></Layout>} />

    <Route path={`${URLS.EDITOR}/*`} element={<EditorRoutes />} />

    <Route path={URLS.LOGIN} element={<PublicLayout><Login /></PublicLayout>} />

    <Route path="/" element={<Navigate to={URLS.FLOWS} />} />

    <Route element={<Layout><div>404</div></Layout>} />
  </Routes>
);
