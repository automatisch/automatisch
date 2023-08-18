import { IApp } from '@automatisch/types';
import * as React from 'react';

import { processStep } from 'helpers/authenticationSteps';
import computeAuthStepVariables from 'helpers/computeAuthStepVariables';
import useApp from './useApp';

type UseAuthenticateAppParams = {
  appKey: string;
  appAuthClientId?: string;
  useShared?: boolean;
  connectionId?: string;
}

type AuthenticatePayload = {
  fields?: Record<string, string>;
  appAuthClientId?: string;
}

function getSteps(auth: IApp['auth'], hasConnection: boolean, useShared: boolean) {
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

export default function useAuthenticateApp(payload: UseAuthenticateAppParams) {
  const {
    appKey,
    appAuthClientId,
    connectionId,
    useShared = false,
  } = payload;
  const { app } = useApp(appKey);
  const [
    authenticationInProgress,
    setAuthenticationInProgress
  ] = React.useState(false);
  const steps = getSteps(app?.auth, !!connectionId, useShared);

  const authenticate = React.useMemo(() => {
    if (!steps?.length) return;

    return async function authenticate(payload: AuthenticatePayload = {}) {
      const {
        fields,
      } = payload;
      setAuthenticationInProgress(true);

      const response: Record<string, any> = {
        key: appKey,
        appAuthClientId: appAuthClientId || payload.appAuthClientId,
        connection: {
          id: connectionId,
        },
        fields
      };

      let stepIndex = 0;
      while (stepIndex < steps?.length) {
        const step = steps[stepIndex];
        const variables = computeAuthStepVariables(step.arguments, response);

        try {
          const stepResponse = await processStep(step, variables);

          response[step.name] = stepResponse;
        } catch (err) {
          console.log(err);
          throw err;

          setAuthenticationInProgress(false);
          break;
        }

        stepIndex++;

        if (stepIndex === steps.length) {
          return response;
        }

        setAuthenticationInProgress(false);
      }
    }
  }, [steps, appKey, appAuthClientId, connectionId]);

  return {
    authenticate,
    inProgress: authenticationInProgress,
  };
}
