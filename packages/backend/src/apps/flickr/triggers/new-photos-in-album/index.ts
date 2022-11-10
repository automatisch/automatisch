import defineTrigger from '../../../../helpers/define-trigger';
import newPhotosInAlbum from './new-photos-in-album';

export default defineTrigger({
  name: 'New photos in album',
  pollInterval: 15,
  key: 'newPhotosInAlbum',
  description: 'Triggers when you add a new photo in an album.',
  arguments: [
    {
      label: 'Album',
      key: 'album',
      type: 'dropdown' as const,
      required: true,
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listAlbums',
          },
        ],
      },
    },
  ],

  async run($) {
    await newPhotosInAlbum($);
  },
});
