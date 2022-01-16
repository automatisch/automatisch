import apolloClient from 'graphql/client';
import MUTATIONS from 'graphql/mutations';
import appConfig from 'config/app';

enum AuthenticationSteps {
  Mutation = 'mutation',
  OpenWithPopup = 'openWithPopup',
}

type Step = {
  name: string;
  variables: Record<string, unknown>;
  process: (step: any, variables: Record<string, unknown>) => Promise<any>;
  type: AuthenticationSteps.Mutation | AuthenticationSteps.OpenWithPopup;
};

const processMutation = async (step: Step, variables: Record<string, unknown>) => {
  const mutation = MUTATIONS[step.name];
  const mutationResponse = await apolloClient.mutate({ mutation, variables });
  const responseData = mutationResponse.data[step.name];

  return responseData;
};

const parseUrlSearchParams = (event: any) => {
  const searchParams = new URLSearchParams(event.data.payload);

  return getObjectOfEntries(searchParams.entries());
};

function getObjectOfEntries(iterator: any) {
  const result: any = {};

  for (const [key, value] of iterator) {
    result[key] = value;
  }

  return result;
}

const processOpenWithPopup = (step: Step, variables: Record<string, string>) => {
  return new Promise((resolve) => {
    const windowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    const url = variables.url;

    const popup: any = window.open(url, '_blank', windowFeatures);
    popup?.focus();

    const messageHandler = async (event: any) => {
      // check origin and data.source to trust the event
      if (event.origin !== appConfig.baseUrl || event.data.source !== 'automatisch') {
        return;
      }

      const data = parseUrlSearchParams(event);
      window.removeEventListener('message', messageHandler);

      resolve(data);
    };

    window.addEventListener('message', messageHandler, false);
  });
};

export const processStep = async (step: Step, variables: Record<string, string>): Promise<any> => {
  if (step.type === AuthenticationSteps.Mutation) {
    return processMutation(step, variables);
  } else if (step.type === AuthenticationSteps.OpenWithPopup) {
    return processOpenWithPopup(step, variables);
  }
};
