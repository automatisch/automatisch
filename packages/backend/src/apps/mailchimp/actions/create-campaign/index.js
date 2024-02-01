import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create campaign',
  key: 'createCampaign',
  description: 'Creates a new campaign draft.',
  arguments: [
    {
      label: 'Campaign Name',
      key: 'campaignName',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Audience',
      key: 'audienceId',
      type: 'dropdown',
      required: true,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listAudiences',
          },
        ],
      },
    },
    {
      label: 'Segment or Tag',
      key: 'segmentOrTagId',
      type: 'dropdown',
      required: false,
      dependsOn: ['parameters.audienceId'],
      description:
        'Choose the specific segment or tag to which you"d like to direct the campaign. If no segment or tag is chosen, the campaign will be distributed to the entire audience previously selected.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listSegmentsOrTags',
          },
          {
            name: 'parameters.audienceId',
            value: '{parameters.audienceId}',
          },
        ],
      },
    },
    {
      label: 'Email Subject',
      key: 'emailSubject',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Preview Text',
      key: 'previewText',
      type: 'string',
      required: false,
      description:
        'The snippet will be visible in the inbox following the subject line.',
      variables: true,
    },
    {
      label: 'From Name',
      key: 'fromName',
      type: 'string',
      required: true,
      description: 'The "from" name on the campaign (not an email address).',
      variables: true,
    },
    {
      label: 'From Email Address',
      key: 'fromEmailAddress',
      type: 'string',
      required: true,
      description: 'The reply-to email address for the campaign.',
      variables: true,
    },
    {
      label: 'To Name',
      key: 'toName',
      type: 'string',
      required: false,
      description:
        'Supports *|MERGETAGS|* for recipient name, such as *|FNAME|*, *|LNAME|*, *|FNAME|* *|LNAME|*, etc.',
      variables: true,
    },
    {
      label: 'Template',
      key: 'templateId',
      type: 'dropdown',
      required: false,
      description:
        'Select either a template or provide HTML email content, you cannot provide both. If both fields are left blank, the campaign draft will have no content.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listTemplates',
          },
        ],
      },
    },
    {
      label: 'Email Content (HTML)',
      key: 'emailContent',
      type: 'string',
      required: false,
      description:
        'Select either a template or provide HTML email content, you cannot provide both. If both fields are left blank, the campaign draft will have no content.',
      variables: true,
    },
  ],

  async run($) {
    const {
      campaignName,
      audienceId,
      segmentOrTagId,
      emailSubject,
      previewText,
      fromName,
      fromEmailAddress,
      toName,
      templateId,
      emailContent,
    } = $.step.parameters;

    const body = {
      type: 'regular',
      recipients: {
        list_id: audienceId,
        segment_opts: {
          saved_segment_id: Number(segmentOrTagId),
        },
      },
      settings: {
        subject_line: emailSubject,
        reply_to: fromEmailAddress,
        title: campaignName,
        preview_text: previewText,
        from_name: fromName,
        to_name: toName,
      },
    };

    const { data: campaign } = await $.http.post('/3.0/campaigns', body);

    const campaignBody = {
      template: {
        id: Number(templateId),
      },
      html: emailContent,
    };

    const { data } = await $.http.put(
      `/3.0/campaigns/${campaign.id}/content`,
      campaignBody
    );

    $.setActionItem({
      raw: data,
    });
  },
});
