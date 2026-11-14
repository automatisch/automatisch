import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'List APIs',
  key: 'listApis',
  description: 'Lists every API on the Datacircle sheet.',
  arguments: [],

  async run($) {
    const { data } = await $.http.get('https://api.datacircle.dev/v1/apis');

    $.setActionItem({
      raw: data,
    });
  },
});
