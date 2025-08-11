import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Execute',
  key: 'execute',
  description:
    'Creates branching paths in your workflow for conditional logic.',
  arguments: [
    {
      label: 'Branch mode',
      key: 'branchMode',
      type: 'dropdown',
      required: true,
      value: 'parallel',
      description: 'How branches should execute.',
      variables: false,
      options: [
        {
          label: 'Parallel (all branches run)',
          value: 'parallel',
        },
        {
          label: 'Conditional (first matching branch runs)',
          value: 'conditional',
        },
      ],
    },
  ],

  async run($) {
    const { branchMode } = $.step.parameters;

    const dataItem = {
      branchMode,
      structuralType: 'paths',
      executedAt: new Date().toISOString(),
    };

    $.setActionItem({ raw: dataItem });
  },
});
