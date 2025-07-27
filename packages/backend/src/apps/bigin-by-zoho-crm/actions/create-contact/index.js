import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create contact',
  key: 'createContact',
  description: 'Creates a new contact.',
  arguments: [
    {
      label: 'Contact Owner',
      key: 'contactOwnerId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listContactOwners',
          },
        ],
      },
    },
    {
      label: 'First Name',
      key: 'firstName',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Last Name',
      key: 'lastName',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Email',
      key: 'email',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Company ID',
      key: 'companyId',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listCompanies',
          },
        ],
      },
    },
    {
      label: 'Mobile',
      key: 'mobile',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Email Opt Out',
      key: 'emailOptOut',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'True', value: true },
        { label: 'False', value: false },
      ],
    },
    {
      label: 'Tags',
      key: 'tags',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Tag',
          key: 'tag',
          type: 'string',
          required: false,
          variables: true,
        },
      ],
    },
    {
      label: 'Description',
      key: 'description',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Mailing Street',
      key: 'mailingStreet',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Mailing City',
      key: 'mailingCity',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Mailing State',
      key: 'mailingState',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Mailing Country',
      key: 'mailingCountry',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Mailing Zip',
      key: 'mailingZip',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
  ],

  async run($) {
    const {
      contactOwnerId,
      firstName,
      lastName,
      title,
      email,
      companyId,
      mobile,
      emailOptOut,
      tags,
      description,
      mailingStreet,
      mailingCity,
      mailingState,
      mailingCountry,
      mailingZip,
    } = $.step.parameters;

    const allTags = tags.map((tag) => ({
      name: tag.tag,
    }));

    const body = {
      data: [
        {
          Owner: {
            id: contactOwnerId,
          },
          Account_Name: {
            id: companyId,
          },
          First_Name: firstName,
          Last_Name: lastName,
          Title: title,
          Email: email,
          Mobile: mobile,
          Email_Opt_Out: emailOptOut,
          Tag: allTags,
          Description: description,
          Mailing_Street: mailingStreet,
          Mailing_City: mailingCity,
          Mailing_State: mailingState,
          Mailing_Country: mailingCountry,
          Mailing_Zip: mailingZip,
        },
      ],
    };

    const { data } = await $.http.post(`/bigin/v2/Contacts`, body);

    $.setActionItem({
      raw: data[0],
    });
  },
});
