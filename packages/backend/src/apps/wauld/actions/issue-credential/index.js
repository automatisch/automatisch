import defineAction from '../../../../helpers/define-action.js';
import getCustomAttributeKey from '../../common/get-custom-attribute-key.js';

const parseBoolean = (value, defaultValue = true) => {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  return String(value).toLowerCase() === 'true';
};

const getDocumentCustomAttributes = async ($, documentId) => {
  const { data } = await $.http.post(
    '/wauld.DocumentService/GetDocument',
    {
      id: documentId,
    }
  );

  const document = data.document || data;

  if (!Array.isArray(document.customAttributes)) {
    return [];
  }

  return document.customAttributes.filter(
    (attributeName) =>
      typeof attributeName === 'string' &&
      attributeName.trim() &&
      attributeName.trim().toLowerCase() !== 'name'
  );
};

const buildCredentialAttributes = async ($, documentId) => {
  const customAttributeNames = await getDocumentCustomAttributes(
    $,
    documentId
  );

  return customAttributeNames
    .map((attributeName) => {
      const parameterKey = getCustomAttributeKey(attributeName);
      const value = $.step.parameters[parameterKey];

      return {
        name: attributeName,
        value,
      };
    })
    .filter(
      (attribute) =>
        attribute.value !== undefined &&
        attribute.value !== null &&
        String(attribute.value).length > 0
    )
    .map((attribute) => ({
      name: attribute.name,
      value: String(attribute.value),
    }));
};

export default defineAction({
  name: 'Issue Credential',
  key: 'issueCredential',
  description:
    'Issues a new credential using the selected document and recipient details.',

  arguments: [
    {
      label: 'Workspace',
      key: 'workspaceId',
      type: 'dropdown',
      required: true,
      variables: false,
      description:
        'Choose the Wauld workspace where the document to be issued is located.',
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listWorkspaces',
          },
        ],
      },
    },

    {
      label: 'Engagement',
      key: 'engagementId',
      type: 'dropdown',
      required: true,
      variables: false,
      description:
        'Choose the engagement within which the document to be issued is located.',
      dependsOn: ['parameters.workspaceId'],
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listEngagements',
          },
          {
            name: 'parameters.workspaceId',
            value: '{parameters.workspaceId}',
          },
        ],
      },
    },

    {
      label: 'Document',
      key: 'documentId',
      type: 'dropdown',
      required: true,
      variables: false,
      description:
        'Choose the document that is to be issued as a credential.',
      dependsOn: ['parameters.engagementId'],
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listDocuments',
          },
          {
            name: 'parameters.engagementId',
            value: '{parameters.engagementId}',
          },
        ],
      },
      additionalFields: {
        type: 'query',
        name: 'getDynamicFields',
        arguments: [
          {
            name: 'key',
            value: 'listDocumentCustomAttributeFields',
          },
          {
            name: 'parameters.documentId',
            value: '{parameters.documentId}',
          },
        ],
      },
    },

    {
      label: 'Recipient Name',
      key: 'recipientName',
      type: 'string',
      required: true,
      variables: true,
      description:
        'Enter the full name of the recipient that will receive the credential.',
    },

    {
      label: 'Recipient Email',
      key: 'recipientEmail',
      type: 'string',
      required: true,
      variables: true,
      description:
        'Enter the email address of the recipient. Wauld will send the issued credential to this email address.',
    },

    {
      label: 'Shareable',
      key: 'sharable',
      type: 'dropdown',
      required: false,
      variables: false,
      value: true,
      description:
        'Choose whether recipients can share issued credentials externally.',
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },

    {
      label: 'Add to LinkedIn',
      key: 'linkedIn',
      type: 'dropdown',
      required: false,
      variables: false,
      value: true,
      description:
        'Choose whether recipients can add issued credentials to their LinkedIn profiles.',
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
    },

    {
      label: 'Expiry Date',
      key: 'expireTime',
      type: 'string',
      required: false,
      variables: true,
      description:
        'Enter the expiry date and time for the credential in RFC 3339 format, for example: 2026-12-31T23:59:59Z. Leave this field blank if the credential should never expire.',
    },
  ],

  async run($) {
    const {
      workspaceId,
      engagementId,
      documentId,
      recipientName,
      recipientEmail,
      expireTime,
      sharable,
      linkedIn,
    } = $.step.parameters;

    if (!workspaceId) {
      throw new Error('Workspace is required.');
    }

    if (!engagementId) {
      throw new Error('Engagement is required.');
    }

    if (!documentId) {
      throw new Error('Document is required.');
    }

    if (!recipientName) {
      throw new Error('Recipient Name is required.');
    }

    if (!recipientEmail) {
      throw new Error('Recipient Email is required.');
    }

    const attributes = await buildCredentialAttributes(
      $,
      documentId
    );

    const payload = {
      parent: documentId,
      recipient: {
        name: recipientName,
        email: recipientEmail,
      },
      sharable: parseBoolean(sharable, true),
      linkedIn: parseBoolean(linkedIn, true),
    };

    if (attributes.length > 0) {
      payload.attributes = attributes;
    }

    if (expireTime) {
      payload.expireTime = expireTime;
    }

    const response = await $.http.post(
      '/wauld.CredentialService/PublishAdhocCredential',
      payload
    );

    const responseData = response.data;

    const hasResponseData =
      responseData !== undefined &&
      responseData !== null &&
      responseData !== '' &&
      !(
        typeof responseData === 'object' &&
        !Array.isArray(responseData) &&
        Object.keys(responseData).length === 0
      );

    $.setActionItem({
      raw: hasResponseData
        ? responseData
        : {
            success: true,
            documentId,
            recipient: {
              name: recipientName,
              email: recipientEmail,
            },
            attributes,
            expireTime: expireTime || null,
            sharable: payload.sharable,
            linkedIn: payload.linkedIn,
          },
    });
  },
});