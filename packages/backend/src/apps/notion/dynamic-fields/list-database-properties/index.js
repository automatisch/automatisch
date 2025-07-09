export default {
  name: 'List database properties',
  key: 'listDatabaseProperties',

  async run($) {
    const databaseId = $.step.parameters.databaseId;

    if (!databaseId) {
      return [];
    }

    const response = await $.http.get(`/v1/databases/${databaseId}`);
    const properties = response.data.properties;

    const fields = [];

    for (const [propertyName, propertyConfig] of Object.entries(properties)) {
      const propertyType = propertyConfig.type;

      // Skip computed/read-only properties
      if (
        [
          'created_time',
          'last_edited_time',
          'created_by',
          'last_edited_by',
          'formula',
          'rollup',
        ].includes(propertyType)
      ) {
        continue;
      }

      let fieldConfig = {
        label: propertyName,
        key: `property_${propertyName}`,
        required: false,
        variables: true,
      };

      switch (propertyType) {
        case 'title':
        case 'rich_text':
        case 'email':
        case 'phone_number':
        case 'url':
          fieldConfig.type = 'string';
          fieldConfig.description = `Update ${propertyName} (${propertyType})`;
          break;

        case 'number':
          fieldConfig.type = 'string';
          fieldConfig.description = `Update ${propertyName} (number)`;
          break;

        case 'checkbox':
          fieldConfig.type = 'dropdown';
          fieldConfig.options = [
            { label: 'True', value: 'true' },
            { label: 'False', value: 'false' },
          ];
          fieldConfig.description = `Update ${propertyName} (checkbox)`;
          break;

        case 'select':
          fieldConfig.type = 'dropdown';
          fieldConfig.options = propertyConfig.select.options.map((option) => ({
            label: option.name,
            value: option.name,
          }));
          fieldConfig.description = `Update ${propertyName} (select)`;
          break;

        case 'multi_select':
          fieldConfig.type = 'dynamic';
          fieldConfig.description = `Update ${propertyName} (multi-select)`;
          fieldConfig.fields = [
            {
              label: 'Option',
              key: 'option',
              type: 'dropdown',
              required: true,
              variables: true,
              options: propertyConfig.multi_select.options.map((option) => ({
                label: option.name,
                value: option.name,
              })),
            },
          ];
          break;

        case 'date':
          fieldConfig.type = 'string';
          fieldConfig.description = `Update ${propertyName} (date) - Format: YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS`;
          break;

        case 'people':
          fieldConfig.type = 'dynamic';
          fieldConfig.description = `Update ${propertyName} (people)`;
          fieldConfig.fields = [
            {
              label: 'User ID',
              key: 'userId',
              type: 'string',
              required: true,
              variables: true,
              description: 'Notion user ID',
            },
          ];
          break;

        case 'files':
          fieldConfig.type = 'dynamic';
          fieldConfig.description = `Update ${propertyName} (files)`;
          fieldConfig.fields = [
            {
              label: 'File URL',
              key: 'url',
              type: 'string',
              required: true,
              variables: true,
              description: 'External file URL',
            },
            {
              label: 'File Name',
              key: 'name',
              type: 'string',
              required: false,
              variables: true,
              description: 'Optional file name',
            },
          ];
          break;

        case 'relation':
          fieldConfig.type = 'dynamic';
          fieldConfig.description = `Update ${propertyName} (relation)`;
          fieldConfig.fields = [
            {
              label: 'Page ID',
              key: 'pageId',
              type: 'string',
              required: true,
              variables: true,
              description: 'ID of the related page',
            },
          ];
          break;

        default:
          // Skip unsupported property types
          continue;
      }

      fields.push(fieldConfig);
    }

    return fields;
  },
};
