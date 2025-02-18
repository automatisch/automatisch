export default {
  name: 'List my drives',
  key: 'listMyDrives',

  async run($) {
    let response;
    let requestPath = `/me/drives`;
    response = await $.http.get(requestPath);

    response.data.value.forEach((drive) => {
      const dataItem = {
        raw: drive,
        meta: {
          internalId: `${drive.id}`,
        },
      };

      $.pushTriggerItem(dataItem);
    });
  },

};
