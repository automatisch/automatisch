export default {
  name: 'List contacts',
  key: 'listContacts',

  async run($) {
    const contacts = {
      data: [],
    };

    const params = {
      operation: 'query',
      sessionName: $.auth.data.sessionName,
      query: 'SELECT * FROM Contacts ORDER BY createdtime DESC;',
    };

    const { data } = await $.http.get(`/webservice.php`, { params });

    if (data.result?.length) {
      for (const contact of data.result) {
        contacts.data.push({
          value: contact.id,
          name: `${contact.firstname} ${contact.lastname}`,
        });
      }
    }

    return contacts;
  },
};
