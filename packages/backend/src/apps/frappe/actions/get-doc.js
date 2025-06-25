import defineAction from '../../../helpers/define-action.js';
import { getFrappeDocumentAPIUrl } from '../common/utils.js';

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
        const response = await $.http.get(`${getFrappeDocumentAPIUrl($, doctype)}/${documentName}`);

        $.setActionItem({ raw: response.data });
    },
})