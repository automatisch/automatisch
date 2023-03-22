import defineTrigger from '../../../../helpers/define-trigger';
import newFiles from './new-files';

export default defineTrigger({
  name: 'New Files',
  key: 'newFiles',
  pollInterval: 15,
  description: 'Triggers when any new file is added (inside of any folder).',

  async run($) {
    await newFiles($);
  },
});
