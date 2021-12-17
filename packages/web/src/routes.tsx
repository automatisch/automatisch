import { Route, Routes, Navigate } from 'react-router-dom';
import Layout from 'components/Layout';
import Applications from 'pages/Applications';
import Application from 'pages/Application';
import Flows from 'pages/Flows';
import Explore from 'pages/Explore';
import Editor from 'pages/Editor';
import * as URLS from 'config/urls';

export default (
  <Routes>
    <Route path={URLS.FLOWS} element={<Layout><Flows /></Layout>} />

    <Route path={`${URLS.APPS}/*`} element={<Layout><Applications /></Layout>} />

    <Route path={URLS.EXPLORE} element={<Layout><Explore /></Layout>} />

    <Route path={`${URLS.APP_PATTERN}/*`} element={<Layout><Application /></Layout>} />

    <Route path={`${URLS.EDITOR}/*`} element={<Editor />} />

    <Route path="/" element={<Navigate to={URLS.FLOWS} />} />

    <Route element={<Layout><div>404</div></Layout>} />
  </Routes>
);
