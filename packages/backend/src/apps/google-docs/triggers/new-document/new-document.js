const newDocument = async ($) => {
  const params = {
    pageToken: undefined,
    orderBy: 'createdTime desc',
    q: `mimeType='application/vnd.google-apps.document'`,
    fields: '*',
    pageSize: 1000,
    driveId: $.step.parameters.driveId,
    supportsAllDrives: true,
  };

  if ($.step.parameters.driveId) {
    params.includeItemsFromAllDrives = true;
    params.corpora = 'drive';
  }

  do {
    const { data } = await $.http.get(
      'https://www.googleapis.com/drive/v3/files',
      { params }
    );
    params.pageToken = data.nextPageToken;

    if (data.files?.length) {
      for (const file of data.files) {
        $.pushTriggerItem({
          raw: file,
          meta: {
            internalId: file.id,
          },
        });
      }
    }
  } while (params.pageToken);
};

export default newDocument;
