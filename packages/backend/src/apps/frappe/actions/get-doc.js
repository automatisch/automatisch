import defineAction from '../../../helpers/define-action.js';
import { getDocumentAPIBase } from '../common/utils.js';

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
            variables: false,
        },
        {
            label: 'Document Name',
            key: 'documentName',
            type: 'string',
            required: true,
            description: 'The name of the document to retrieve.',
            variables: false,
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const documentName = $.step.parameters.documentName;
        const response = await $.http.get(`${getDocumentAPIBase($, doctype)}/${documentName}`);

        $.setActionItem({ raw: response.data });
    },
})