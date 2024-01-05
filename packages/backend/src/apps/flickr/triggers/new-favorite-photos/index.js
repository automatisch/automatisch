import defineTrigger from '../../../../helpers/define-trigger.js';
import newFavoritePhotos from './new-favorite-photos.js';

export default defineTrigger({
  name: 'New favorite photos',
  pollInterval: 15,
  key: 'newFavoritePhotos',
  description: 'Triggers when you favorite a photo.',

  async run($) {
    await newFavoritePhotos($);
  },
});
