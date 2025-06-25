import defineAction from '../../../helpers/define-action.js';
import { getFrappeDocumentAPIUrl } from '../common/utils.js';

export default defineAction({
    name: 'Delete Document',
    key: 'deleteDoc',
    description: 'Delete a document from Frappe.',
    arguments: [
        {
            label: 'Document Type',
            key: 'doctype',
            type: 'string',
            required: true,
            description: 'The type of the doctype to delete.',
            variables: true,
        },
        {
            label: 'Document Name',
            key: 'documentName',
            type: 'string',
            required: true,
            description: 'The name of the document to delete.',
            variables: true,
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const documentName = $.step.parameters.documentName;
        const response = await $.http.delete(`${getFrappeDocumentAPIUrl($, doctype)}/${documentName}`);

        $.setActionItem({ raw: response.data });
    },
})