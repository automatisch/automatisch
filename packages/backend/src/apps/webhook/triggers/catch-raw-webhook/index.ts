import isEmpty from 'lodash/isEmpty';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'Catch raw webhook',
  key: 'catchRawWebhook',
  type: 'webhook',
  description: 'Triggers when the webhook receives a request.',

  async testRun($) {
    if (!isEmpty($.lastExecutionStep?.dataOut)) {
      $.pushTriggerItem({
        raw: $.lastExecutionStep.dataOut,
        meta: {
          internalId: '',
        }
      });
    }
  },
});
