import { IJSONArray, IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import { fields } from './fields';
import isEmpty from 'lodash/isEmpty';

type Payload = {
  ticket: IJSONObject;
};

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

    const collaborators = $.step.parameters.collaborators as IJSONArray;
    const collaboratorIds = collaborators?.map(
      (collaborator: IJSONObject) => collaborator.collaborator
    );

    const collaboratorEmails = $.step.parameters
      .collaboratorEmails as IJSONArray;
    const formattedCollaboratorEmails = collaboratorEmails?.map(
      (collaboratorEmail: IJSONObject) => collaboratorEmail.collaboratorEmail
    );

    const formattedCollaborators = [
      ...collaboratorIds,
      ...formattedCollaboratorEmails,
    ];

    const sharingAgreements = $.step.parameters.sharingAgreements as IJSONArray;
    const sharingAgreementIds = sharingAgreements
      ?.filter(isEmpty)
      .map((sharingAgreement: IJSONObject) =>
        Number(sharingAgreement.sharingAgreement)
      );

    const tags = $.step.parameters.tags as string;
    const formattedTags = tags.split(',');

    const payload: Payload = {
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
