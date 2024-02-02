import defineTrigger from '../../../../helpers/define-trigger.js';
import newAlbums from './new-albums.js';

export default defineTrigger({
  name: 'New albums',
  pollInterval: 15,
  key: 'newAlbums',
  description: 'Triggers when you create a new album.',

  async run($) {
    await newAlbums($);
  },
});
