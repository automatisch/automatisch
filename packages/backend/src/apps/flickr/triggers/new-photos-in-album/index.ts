import defineTrigger from '../../../../helpers/define-trigger';
import newPhotosInAlbum from './new-photos-in-album';

export default defineTrigger({
  name: 'New photos in album',
  pollInterval: 15,
  key: 'newPhotosInAlbum',
  description: 'Triggers when you add a new photo in an album.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: [
        {
          label: 'Album',
          key: 'album',
          type: 'dropdown',
          required: true,
          variables: false,
          source: {
            type: 'query',
            name: 'getData',
            arguments: [
              {
                name: 'key',
                value: 'listAlbums',
              },
            ],
          },
        },
      ],
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await newPhotosInAlbum($);
  },
});
