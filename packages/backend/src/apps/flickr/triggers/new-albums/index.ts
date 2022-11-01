import defineTrigger from '../../../../helpers/define-trigger';
import newAlbums from './new-albums';

export default defineTrigger({
  name: 'New albums',
  pollInterval: 15,
  key: 'newAlbums',
  description: 'Triggers when you create a new album.',

  async run($) {
    await newAlbums($);
  },
});
