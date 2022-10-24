import defineTrigger from '../../../../helpers/define-trigger';
import newFavoritePhotos from './new-favorite-photos';

export default defineTrigger({
  name: 'New favorite photos',
  pollInterval: 15,
  key: 'newFavoritePhotos',
  description: 'Triggers when you favorite a photo.',
  dedupeStrategy: 'unique',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection'
    },
    {
      key: 'testStep',
      name: 'Test trigger'
    }
  ],

  async run($) {
    await newFavoritePhotos($);
  },
});
