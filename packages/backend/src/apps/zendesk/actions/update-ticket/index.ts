import defineAction from '../../../../helpers/define-action';
import { fields } from './fields';
import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';

export default defineAction({
  name: 'Update ticket',
  key: 'updateTicket',
  description: 'Modify the status of an existing ticket or append comments.',
  arguments: fields,

  async run($) {
    const {
      ticketId,
      subject,
      assigneeId,
      groupId,
      status,
      comment,
      publicOrNot,
      type,
      priority,
      submitterId,
    } = $.step.parameters;

    const tags = $.step.parameters.tags as string;
    const formattedTags = tags.split(',');

    const payload = {
      subject,
      assignee_id: assigneeId,
      group_id: groupId,
      status,
      comment: {
        body: comment,
        public: publicOrNot,
      },
      tags: formattedTags,
      type,
      priority,
      submitter_id: submitterId,
    };

    const fieldsToRemoveIfEmpty = ['group_id', 'status', 'type', 'priority'];

    const filteredPayload = omitBy(
      payload,
      (value, key) => fieldsToRemoveIfEmpty.includes(key) && isEmpty(value)
    );

    const response = await $.http.put(`/api/v2/tickets/${ticketId}`, {
      ticket: filteredPayload,
    });

    $.setActionItem({ raw: response.data });
  },
});
