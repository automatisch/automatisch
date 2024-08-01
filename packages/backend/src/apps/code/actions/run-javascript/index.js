import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Run Javascript',
  key: 'runJavascript',
  description:
    'Run browser Javascript code. You can not use NodeJS specific features and npm packages.',
  arguments: [
    {
      label: 'Inputs',
      key: 'inputs',
      type: 'dynamic',
      required: false,
      description:
        'To be able to use data from previous steps, you need to expose them as input entries. You can access these input values in your code by using the `inputs` argument.',
      value: [
        {
          key: '',
          value: '',
        },
      ],
      fields: [
        {
          label: 'Key',
          key: 'key',
          type: 'string',
          required: true,
          variables: true,
        },
        {
          label: 'Value',
          key: 'value',
          type: 'string',
          required: true,
          variables: true,
        },
      ],
    },
    {
      label: 'Code Snippet',
      key: 'codeSnippet',
      type: 'code',
      required: true,
      variables: false,
      value:
        'const code = async (inputs) => { \n  // E.g. if you have an input called username,\n  // you can access its value by calling inputs.username\n  // Return value will be used as output of this step.\n\n  return true;\n};',
    },
  ],

  async run($) {
    const { inputs = [], codeSnippet } = $.step.parameters;

    const objectifiedInput = {};
    for (const input of inputs) {
      if (input.key) {
        objectifiedInput[input.key] = input.value;
      }
    }

    const ivm = (await import('isolated-vm')).default;
    const isolate = new ivm.Isolate({ memoryLimit: 128 });

    try {
      const context = await isolate.createContext();
      await context.global.set(
        'inputs',
        new ivm.ExternalCopy(objectifiedInput).copyInto()
      );

      const compiledCodeSnippet = await isolate.compileScript(
        `${codeSnippet}; code(inputs);`
      );
      const codeFunction = await compiledCodeSnippet.run(context, {
        reference: true,
        promise: true,
      });

      $.setActionItem({ raw: { output: await codeFunction.copy() } });
    } finally {
      isolate.dispose();
    }
  },
});
