import { Route, Navigate } from 'react-router-dom';
import SettingsLayout from 'components/SettingsLayout';
import ProfileSettings from 'pages/ProfileSettings';

import * as URLS from 'config/urls';

export default (
  <>
    <Route path={URLS.SETTINGS_PROFILE} element={<SettingsLayout><ProfileSettings /></SettingsLayout>} />

    <Route path={URLS.SETTINGS} element={<Navigate to={URLS.SETTINGS_PROFILE} replace />} />
  </>
);
