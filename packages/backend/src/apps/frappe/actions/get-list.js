import defineAction from '../../../helpers/define-action.js';

export default defineAction({
    name: 'Get Document List',
    key: 'getList',
    description: 'Get a list of documents from Frappe.',
    arguments: [
        {
            label: 'Document Type',
            key: 'doctype',
            type: 'string',
            required: true,
            description: 'The type of the doctype to retrieve the list for.',
            variables: true,
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const siteUrl = $.auth.data.site_url;
        const response = await $.http.get(`${siteUrl}/api/v2/document/${doctype}`);

        $.setActionItem({ raw: response.data });
    },
})