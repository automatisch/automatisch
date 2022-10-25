import defineTrigger from '../../../../helpers/define-trigger';
import newAlbums from './new-albums';

export default defineTrigger({
  name: 'New albums',
  pollInterval: 15,
  key: 'new-albums',
  description: 'Triggers when you create a new album.',
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
    await newAlbums($);
  },
});
