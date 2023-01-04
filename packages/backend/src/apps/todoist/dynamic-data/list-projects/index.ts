import { IGlobalVariable } from '@automatisch/types';

export default {
  name: 'List projects',
  key: 'listProjects',

  async run($: IGlobalVariable) {
    const response = await $.http.get('/projects');

    response.data = response.data.map((project: { id: string, name: string }) => {
      return {
        value: project.id,
        name: project.name,
      };
    });

    return response;
  },
};
