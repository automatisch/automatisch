export default {
  name: 'List project databases',
  key: 'listProjectDatabases',

  async run($) {
    const firestoreDatabases = {
      data: [],
    };
    const projectId = $.auth.data.projectId;

    const { data } = await $.http.get(`/v1/projects/${projectId}/databases`, {
      additionalProperties: {
        setFirestoreBaseUrl: true,
      },
    });

    if (data.databases?.length) {
      for (const database of data.databases) {
        firestoreDatabases.data.push({
          name: database.name,
          value: database.name,
        });
      }
    }

    return firestoreDatabases;
  },
};
