export default {
  name: 'List sections',
  key: 'listSections',

  async run($) {
    const sections = {
      data: [],
    };
    const projectId = $.step.parameters.projectId;

    if (!projectId) {
      return sections;
    }

    const params = {
      limit: 100,
      offset: undefined,
    };

    do {
      const {
        data: { data, next_page },
      } = await $.http.get(`/1.0/projects/${projectId}/sections`, {
        params,
      });

      params.offset = next_page?.offset;

      if (data) {
        for (const section of data) {
          sections.data.push({
            value: section.gid,
            name: section.name,
          });
        }
      }
    } while (params.offset);

    return sections;
  },
};
