import defineAction from '../../../helpers/define-action.js';

export default defineAction({
    name: 'Get Document',
    key: 'getDoc',
    description: 'Get a single document from Frappe.',
    arguments: [
        {
            label: 'Document Type',
            key: 'doctype',
            type: 'string',
            required: true,
            description: 'The type of the doctype to retrieve.',
            variables: true,
        },
        {
            label: 'Document Name',
            key: 'documentName',
            type: 'string',
            required: true,
            description: 'The name of the document to retrieve.',
            variables: true,
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const documentName = $.step.parameters.documentName;
        const siteUrl = $.auth.data.site_url;
        const response = await $.http.get(`${siteUrl}/api/v2/document/${doctype}/${documentName}`, {
            headers: {
                Authorization: `token ${$.auth.data.api_key}:${$.auth.data.api_secret}`,
            },
        });

        $.setActionItem({ raw: response.data });
    },
})