import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Create attachment',
  key: 'createAttachment',
  description:
    'Creates an attachment of a specified object by given parent ID.',
  arguments: [
    {
      label: 'Parent ID',
      key: 'parentId',
      type: 'string' as const,
      required: true,
      variables: true,
      description:
        'ID of the parent object of the attachment. The following objects are supported as parents of attachments: Account, Asset, Campaign, Case, Contact, Contract, Custom objects, EmailMessage, EmailTemplate, Event, Lead, Opportunity, Product2, Solution, Task',
    },
    {
      label: 'Name',
      key: 'name',
      type: 'string' as const,
      required: true,
      variables: true,
      description: 'Name of the attached file. Maximum size is 255 characters.',
    },
    {
      label: 'Body',
      key: 'body',
      type: 'string' as const,
      required: true,
      variables: true,
      description: 'File data. (Max size is 25MB)',
    },
  ],

  async run($) {
    const { parentId, name, body } = $.step.parameters;

    const options = {
      ParentId: parentId,
      Name: name,
      Body: body,
    };

    const { data } = await $.http.post(
      '/services/data/v56.0/sobjects/Attachment/',
      options
    );

    $.setActionItem({ raw: data });
  },
});
