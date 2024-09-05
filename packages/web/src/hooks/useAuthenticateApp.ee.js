import * as React from 'react';

import {
  processMutation,
  processOpenWithPopup,
  processPopupMessage,
} from 'helpers/authenticationSteps';
import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import useAppAuth from './useAppAuth';
import useFormatMessage from './useFormatMessage';

function getSteps(auth, hasConnection, useShared) {
  if (hasConnection) {
    if (useShared) {
      return auth?.sharedReconnectionSteps;
    }
    return auth?.reconnectionSteps;
  }

  if (useShared) {
    return auth?.sharedAuthenticationSteps;
  }

  return auth?.authenticationSteps;
}

export default function useAuthenticateApp(payload) {
  const { appKey, appAuthClientId, connectionId, useShared = false } = payload;
  const { data: auth } = useAppAuth(appKey);
  const [authenticationInProgress, setAuthenticationInProgress] =
    React.useState(false);
  const formatMessage = useFormatMessage();
  const steps = getSteps(auth?.data, !!connectionId, useShared);

  const authenticate = React.useMemo(() => {
    if (!steps?.length) return;

    return async function authenticate(payload = {}) {
      const { fields } = payload;
      setAuthenticationInProgress(true);

      const response = {
        key: appKey,
        appAuthClientId: appAuthClientId || payload.appAuthClientId,
        connection: {
          id: connectionId,
        },
        fields,
      };
      let stepIndex = 0;

      while (stepIndex < steps?.length) {
        const step = steps[stepIndex];
        const variables = computeAuthStepVariables(step.arguments, response);

        try {
          let popup;

          if (step.type === 'openWithPopup') {
            popup = processOpenWithPopup(variables.url);

            if (!popup) {
              throw new Error(formatMessage('addAppConnection.popupReminder'));
            }
          }

          if (step.type === 'mutation') {
            const stepResponse = await processMutation(step.name, variables);
            response[step.name] = stepResponse;
          } else if (step.type === 'openWithPopup') {
            const stepResponse = await processPopupMessage(popup);
            response[step.name] = stepResponse;
          }
        } catch (err) {
          console.log(err);
          setAuthenticationInProgress(false);
          throw err;
        }
        stepIndex++;

        if (stepIndex === steps.length) {
          return response;
        }
        setAuthenticationInProgress(false);
      }
    };
  }, [steps, appKey, appAuthClientId, connectionId, formatMessage]);

  return {
    authenticate,
    inProgress: authenticationInProgress,
  };
}
