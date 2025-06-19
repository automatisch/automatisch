const replace = ($) => {
  const input = $.step.parameters.input;
  const find = $.step.parameters.find;
  const replace = $.step.parameters.replace;
  const useRegex = $.step.parameters.useRegex;

  if (useRegex) {
    const ignoreCase = $.step.parameters.ignoreCase;

    const flags = [ignoreCase && 'i', 'g'].filter(Boolean).join('');

    const timeoutId = setTimeout(() => {
      $.execution.exit();
    }, 100);

    const regex = new RegExp(find, flags);

    const replacedValue = input.replaceAll(regex, replace);

    clearTimeout(timeoutId);

    return replacedValue;
  }

  return input.replaceAll(find, replace);
};

export default replace;
