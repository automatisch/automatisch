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
      type: 'string',
      required: true,
      variables: false,
      value: 'const code = async (inputs) => { return true; };',
    },
  ],

  async run($) {
    const { inputs = [], codeSnippet } = $.step.parameters;

    const ivm = (await import('isolated-vm')).default;
    const isolate = new ivm.Isolate({ memoryLimit: 128 });

    try {
      const context = await isolate.createContext();

      const externalData = new ivm.ExternalCopy(inputs).copyInto();

      const compiledCodeSnippet = await isolate.compileScript(codeSnippet);

      const codeRun = await compiledCodeSnippet.run(context);

      const codeFunction = await context.global.get('code', {
        reference: true,
        promise: true,
      });

      const result = await codeFunction.apply(undefined, [externalData], {});

      // const codeReturn = await outRef.copy();
      const codeReturn = await result.copy();

      // console.log(codeReturn);

      $.setActionItem({ raw: { output: codeReturn } });
    } finally {
      isolate.dispose();
    }
  },
});
