import { Route, Routes, Navigate } from 'react-router-dom';
import Applications from 'pages/Applications';
import Application from 'pages/Application';
import Flows from 'pages/Flows';
import Explore from 'pages/Explore';
import * as URLS from 'config/urls';

export default (
  <Routes>
    <Route path={URLS.FLOWS} element={<Flows />} />

    <Route path={`${URLS.APPS}/*`} element={<Applications />} />

    <Route path={URLS.EXPLORE} element={<Explore />} />

    <Route path={`${URLS.APP_PATTERN}/*`} element={<Application />} />

    <Route path="/" element={<Navigate to={URLS.FLOWS} />} />

    <Route element={<div>404</div>} />
  </Routes>
);
