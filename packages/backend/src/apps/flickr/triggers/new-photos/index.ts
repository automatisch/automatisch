import defineTrigger from '../../../../helpers/define-trigger';
import newPhotos from './new-photos';

export default defineTrigger({
  name: 'New photos',
  pollInterval: 15,
  key: 'newPhotos',
  description: 'Triggers when you add a new photo.',
  substeps: [
    {
      key: 'chooseConnection',
      name: 'Choose connection',
    },
    {
      key: 'testStep',
      name: 'Test trigger',
    },
  ],

  async run($) {
    await newPhotos($);
  },
});
