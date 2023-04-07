import { Route, Navigate } from 'react-router-dom';
import SettingsLayout from 'components/SettingsLayout';
import { PaddleProvider } from 'contexts/Paddle.ee';
import ProfileSettings from 'pages/ProfileSettings';
import BillingAndUsageSettings from 'pages/BillingAndUsageSettings/index.ee';
import PlanUpgrade from 'pages/PlanUpgrade/index.ee';

import * as URLS from 'config/urls';

export default (
  <>
    <Route
      path={URLS.SETTINGS_PROFILE}
      element={
        <SettingsLayout>
          <ProfileSettings />
        </SettingsLayout>
      }
    />

    <Route
      path={URLS.SETTINGS_BILLING_AND_USAGE}
      element={
        <SettingsLayout>
          <BillingAndUsageSettings />
        </SettingsLayout>
      }
    />

    <Route
      path={URLS.SETTINGS_PLAN_UPGRADE}
      element={
        <SettingsLayout>
          <PaddleProvider>
            <PlanUpgrade />
          </PaddleProvider>
        </SettingsLayout>
      }
    />

    <Route
      path={URLS.SETTINGS}
      element={<Navigate to={URLS.SETTINGS_PROFILE} replace />}
    />
  </>
);
