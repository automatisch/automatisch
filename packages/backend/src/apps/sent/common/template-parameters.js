export const TEMPLATE_PARAMETER_KEY_PREFIX = 'templateParameter_';

export const getTemplateParameterKey = (variableName) =>
  `${TEMPLATE_PARAMETER_KEY_PREFIX}${variableName}`;

/**
 * Collects the template variable values rendered as dynamic fields
 * (see dynamic-fields/list-template-parameters) into Sent's `parameters` map.
 */
export const collectTemplateParameters = (stepParameters = {}) => {
  const parameters = {};

  for (const [key, value] of Object.entries(stepParameters)) {
    if (!key.startsWith(TEMPLATE_PARAMETER_KEY_PREFIX)) continue;

    if (value === undefined || value === null || value === '') continue;

    parameters[key.slice(TEMPLATE_PARAMETER_KEY_PREFIX.length)] = String(value);
  }

  return parameters;
};
