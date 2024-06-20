export default {
  name: 'List todo options',
  key: 'listTodoOptions',

  async run($) {
    const todoOptions = {
      data: [],
    };
    const stage = $.step.parameters.stage;
    const taskType = $.step.parameters.taskType;
    const skippedReason = $.step.parameters.skippedReason;
    const picklistFields = [stage, taskType, skippedReason];

    const params = {
      operation: 'describe',
      sessionName: $.auth.data.sessionName,
      elementType: 'Calendar',
    };

    const { data } = await $.http.get('/webservice.php', { params });

    if (data.result.fields?.length) {
      for (const field of data.result.fields) {
        if (picklistFields.includes(field.name)) {
          field.type.picklistValues.map((item) =>
            todoOptions.data.push({
              value: item.value,
              name: item.label,
            })
          );
        }
      }
    }

    return todoOptions;
  },
};
