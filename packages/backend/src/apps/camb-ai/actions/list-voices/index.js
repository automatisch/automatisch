import defineAction from '../../../../helpers/define-action.js';
import sanitizeForDb from '../../common/sanitize-for-db.js';

export default defineAction({
  name: 'List Voices',
  key: 'listVoices',
  description: 'Lists all available voices in your CAMB AI account.',
  arguments: [],

  async run($) {
    const { data } = await $.http.get('/apis/list-voices');

    $.setActionItem({
      raw: sanitizeForDb(data),
    });
  },
});
