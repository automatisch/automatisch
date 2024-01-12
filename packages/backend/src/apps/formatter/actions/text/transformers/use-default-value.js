const useDefaultValue = ($) => {
  const input = $.step.parameters.input;

  if (input && input.trim().length > 0) {
    return input;
  }

  return $.step.parameters.defaultValue;
};

export default useDefaultValue;
