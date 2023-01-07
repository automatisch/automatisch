import { IGlobalVariable } from '@automatisch/types';

export default {
  name: 'List sections',
  key: 'listSections',

  async run($: IGlobalVariable) {
    const params = {
      project_id: ($.step.parameters.projectId as string),
    };

    const response = await $.http.get('/sections', {params});

    response.data = response.data.map((section: { id: string, name: string }) => {
      return {
        value: section.id,
        name: section.name,
      };
    });

    return response;
  },
};
