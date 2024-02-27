import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New files in folder',
  key: 'newFilesInFolder',
  pollInterval: 15,
  description:
    'Triggers when a new file is added to a folder. Ensure that the number of files/folders within the monitored directory remains below 4000.',
  arguments: [
    {
      label: 'Folder',
      key: 'folderPath',
      type: 'string',
      required: true,
      description:
        'Enter the folder path that you want to follow, like /TextFiles or /Documents/Taxes.',
      variables: true,
    },
    {
      label: 'Include File Contents?',
      key: 'includeFileContents',
      type: 'dropdown',
      required: true,
      description:
        'Please be advised that files exceeding 100MB in size may result in an error. To prevent errors and exclude file contents, set this option to NO.',
      variables: true,
      options: [
        { label: 'No', value: false },
        { label: 'Yes', value: true },
      ],
    },
  ],

  async run($) {
    const folderPath = $.step.parameters.folderPath;
    let endpoint = '/2/files/list_folder';
    let next = false;

    const params = {
      path: folderPath,
      recursive: false,
      include_deleted: false,
      include_has_explicit_shared_members: false,
      include_mounted_folders: false,
      limit: 2000,
      include_non_downloadable_files: true,
    };

    do {
      const { data } = await $.http.post(endpoint, params);

      if (data.has_more) {
        endpoint += '/continue';
        params.cursor = data.cursor;
        next = data.has_more;
      } else {
        next = false;
      }

      if (data.entries?.length) {
        for (const entry of data.entries.reverse()) {
          if (entry['.tag'] === 'file') {
            $.pushTriggerItem({
              raw: entry,
              meta: {
                internalId: entry.id,
              },
            });
          }
        }
      }
    } while (next);
  },
});
