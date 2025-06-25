import defineAction from '../../../helpers/define-action.js';
import { getFrappeDocumentAPIUrl } from '../common/utils.js';

export default defineAction({
    name: 'Create New Document',
    key: 'createDoc',
    description: 'Create a new document in Frappe.',
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
            label: 'Document Data',
            key: 'documentData',
            type: 'string',
            required: true,
            description: 'The data for the new document. This should be a JSON object containing the fields and their values.',
            variables: true
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const documentData = $.step.parameters.documentData;
        const response = await $.http.post(getFrappeDocumentAPIUrl($, doctype), JSON.parse(documentData));

        $.setActionItem({ raw: response.data });
    },
})