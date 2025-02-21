export default {
  name: 'List my drives',
  key: 'listMyDrives',

  async run($) {
    let response;
    let requestPath = `/me/drives`;
    response = await $.http.get(requestPath);

    const drives = {
      data: [{ value: null, name: 'My OneDrive' }],
    };

    response.data.value.forEach((drive) => {

      drives.data.push({
         value: drive.id,
         name: drive.name,
       });

    });

    return drives
  },

};
