import get from 'lodash.get';

const variableRegExp = /({{step\.[\da-zA-Z-]+(?:\.[^.}{]+)+}})/g;

function getParameterEntries(parameters) {
  return Object.entries(parameters);
}

function computeParameterEntries(parameterEntries, executionSteps) {
  const defaultComputedParameters = {};
  return parameterEntries.reduce((result, [key, value]) => {
    const parameterComputedValue = computeParameter(value, executionSteps);

    return {
      ...result,
      [key]: parameterComputedValue,
    }
  }, defaultComputedParameters);
}

function computeParameter(value, executionSteps) {
  if (typeof value === 'string') {
    const computedStringParameter = computeStringParameter(value, executionSteps);
    return computedStringParameter;
  }

  if (Array.isArray(value)) {
    const computedArrayParameter = computeArrayParameter(value, executionSteps);
    return computedArrayParameter;
  }

  return value;
}

function splitByVariable(stringValue) {
  const parts = stringValue.split(variableRegExp);

  return parts;
}

function isVariable(stringValue) {
  return stringValue.match(variableRegExp);
}

function splitVariableByStepIdAndKeyPath(variableValue) {
  const stepIdAndKeyPath = variableValue.replace(/{{step.|}}/g, '');
  const [stepId, ...keyPaths] = stepIdAndKeyPath.split('.');
  const keyPath = keyPaths.join('.');

  return {
    stepId,
    keyPath
  }
}

function getVariableStepId(variableValue) {
  const { stepId } = splitVariableByStepIdAndKeyPath(variableValue);

  return stepId;
}

function getVariableKeyPath(variableValue) {
  const { keyPath } = splitVariableByStepIdAndKeyPath(variableValue);

  return keyPath
}

function getVariableExecutionStep(variableValue, executionSteps) {
  const stepId = getVariableStepId(variableValue);

  const executionStep = executionSteps.find((executionStep) => {
    return executionStep.stepId === stepId;
  });

  return executionStep;
}

function computeVariable(variable, executionSteps) {
  const keyPath = getVariableKeyPath(variable);
  const executionStep = getVariableExecutionStep(variable, executionSteps);
  const data = executionStep?.dataOut;
  const computedVariable = get(data, keyPath);

  /**
   * Inline both arrays and objects. Otherwise, variables resolving to
   * them would be resolved as `[object Object]` or lose their shape.
   */
  if (typeof computedVariable === 'object') {
    return JSON.stringify(computedVariable);
  }

  return computedVariable;
}

function autoParseComputedVariable(computedVariable) {
  // challenge the input to see if it is stringified object or array
  try {
    const parsedValue = JSON.parse(computedVariable);

    if (typeof parsedValue === 'number') {
      throw new Error('Use original unparsed value.');
    }

    return parsedValue;
  } catch (error) {
    return computedVariable;
  }
}

function computeStringParameter(stringValue, executionSteps) {
  const parts = splitByVariable(stringValue);

  const computedValue = parts
    .map((part) => {
      const variable = isVariable(part);

      if (variable) {
        return computeVariable(part, executionSteps);
      }

      return part;
    })
    .join('');

  const autoParsedValue = autoParseComputedVariable(computedValue);

  return autoParsedValue;
}

function computeArrayParameter(arrayValue, executionSteps) {
  return arrayValue.map((item) => computeParameters(item, executionSteps));
}

export default function computeParameters(parameters, executionSteps) {
  const parameterEntries = getParameterEntries(parameters);

  return computeParameterEntries(parameterEntries, executionSteps);
}
