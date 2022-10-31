import defineTrigger from '../../../../helpers/define-trigger';
import newPhotos from './new-photos';

export default defineTrigger({
  name: 'New photos',
  pollInterval: 15,
  key: 'newPhotos',
  description: 'Triggers when you add a new photo.',

  async run($) {
    await newPhotos($);
  },
});
