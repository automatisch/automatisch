import defineTrigger from '../../../../helpers/define-trigger';
import newPhotos from './new-photos';

export default defineTrigger({
  name: 'New photo',
  pollInterval: 15,
  key: 'newPhoto',
  description: 'Triggers when you add a new photo.',
  dedupeStrategy: 'greatest',
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
    await newPhotos($);
  },
});
