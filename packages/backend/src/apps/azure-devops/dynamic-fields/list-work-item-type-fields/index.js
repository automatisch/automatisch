const hasValue = (value) => value !== null && value !== undefined;

export default {
  name: 'List work item type fields',
  key: 'listWorkItemTypeFields',

  async run($) {
    const options = [];
    const { projectId, workItemType } = $.step.parameters;

    if (!hasValue(projectId) || !hasValue(workItemType)) {
      return;
    }

    const { data } = await $.http.get(
      `/${projectId}/_apis/wit/workitemtypes/${workItemType}/fields`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (data.value) {
      data.value.forEach((field) => {
        const option = {
          label: field.name,
          // Azure DevOps uses dots to label the field name.
          // We replace them with double underscores to avoid creating nested objects.
          key: field.referenceName.replace(/\./g, '__'),
          type: 'string',
          required: field.alwaysRequired,
          variables: true,
        };

        options.push(option);
      });
    }

    return options;
  },
};
