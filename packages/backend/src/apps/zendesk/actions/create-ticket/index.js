import defineAction from '../../../../helpers/define-action.js';
import { fields } from './fields.js';
import isEmpty from 'lodash/isEmpty.js';

export default defineAction({
  name: 'Create ticket',
  key: 'createTicket',
  description: 'Creates a new ticket',
  arguments: fields,

  async run($) {
    const {
      subject,
      assigneeId,
      groupId,
      requesterName,
      requesterEmail,
      format,
      comment,
      publicOrNot,
      status,
      type,
      dueAt,
      priority,
      submitterId,
      ticketForm,
      brandId,
    } = $.step.parameters;

    const collaborators = $.step.parameters.collaborators;
    const collaboratorIds = collaborators?.map(
      (collaborator) => collaborator.collaborator
    );

    const collaboratorEmails = $.step.parameters.collaboratorEmails;
    const formattedCollaboratorEmails = collaboratorEmails?.map(
      (collaboratorEmail) => collaboratorEmail.collaboratorEmail
    );

    const formattedCollaborators = [
      ...collaboratorIds,
      ...formattedCollaboratorEmails,
    ];

    const sharingAgreements = $.step.parameters.sharingAgreements;
    const sharingAgreementIds = sharingAgreements
      ?.filter(isEmpty)
      .map((sharingAgreement) => Number(sharingAgreement.sharingAgreement));

    const tags = $.step.parameters.tags;
    const formattedTags = tags.split(',');

    const payload = {
      ticket: {
        subject,
        assignee_id: assigneeId,
        collaborators: formattedCollaborators,
        group_id: groupId,
        is_public: publicOrNot,
        tags: formattedTags,
        status,
        type,
        due_at: dueAt,
        priority,
        submitter_id: submitterId,
        ticket_form_id: ticketForm,
        sharing_agreement_ids: sharingAgreementIds,
        brand_id: brandId,
      },
    };

    if (requesterName && requesterEmail) {
      payload.ticket.requester = {
        name: requesterName,
        email: requesterEmail,
      };
    }

    if (format === 'HTML') {
      payload.ticket.comment = {
        html_body: comment,
      };
    } else {
      payload.ticket.comment = {
        body: comment,
      };
    }

    const response = await $.http.post('/api/v2/tickets', payload);

    $.setActionItem({ raw: response.data });
  },
});
