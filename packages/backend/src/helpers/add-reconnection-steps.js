import cloneDeep from 'lodash/cloneDeep.js';

const resetConnectionStep = {
  type: 'mutation',
  name: 'resetConnection',
  arguments: [],
};

function removeAppKeyArgument(args) {
  return args.filter((argument) => argument.name !== 'key');
}

function replaceCreateConnectionsWithUpdate(steps) {
  const updatedSteps = cloneDeep(steps);
  return updatedSteps.map((step) => {
    const updatedStep = { ...step };

    if (step.name === 'createConnection') {
      updatedStep.name = 'updateConnection';
      updatedStep.arguments = removeAppKeyArgument(updatedStep.arguments);

      return updatedStep;
    }

    return step;
  });
}

function addReconnectionSteps(app) {
  const hasReconnectionSteps = app.auth.reconnectionSteps;

  if (hasReconnectionSteps) return app;

  if (app.auth.authenticationSteps) {
    const updatedSteps = replaceCreateConnectionsWithUpdate(
      app.auth.authenticationSteps
    );

    app.auth.reconnectionSteps = [resetConnectionStep, ...updatedSteps];
  }

  if (app.auth.sharedAuthenticationSteps) {
    const updatedStepsWithEmbeddedDefaults = replaceCreateConnectionsWithUpdate(
      app.auth.sharedAuthenticationSteps
    );

    app.auth.sharedReconnectionSteps = [
      resetConnectionStep,
      ...updatedStepsWithEmbeddedDefaults,
    ];
  }

  return app;
}

export default addReconnectionSteps;
