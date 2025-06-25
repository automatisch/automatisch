import defineAction from '../../../helpers/define-action.js';
import { getFrappeDocumentAPIUrl } from '../common/utils.js';

export default defineAction({
    name: 'Update Existing Document',
    key: 'updateDoc',
    description: 'Update an existing document in Frappe.',
    arguments: [
        {
            label: 'Document Type',
            key: 'doctype',
            type: 'string',
            required: true,
            description: 'The type of the doctype to update.',
            variables: true,
        },
        {
            label: 'Document Name',
            key: 'documentName',
            type: 'string',
            required: true,
            description: 'The name of the document to update.',
            variables: true,
        },
        {
            label: 'Document Data',
            key: 'dataToUpdate',
            type: 'string',
            required: true,
            description: 'This should be a JSON object containing the fields to update and their values.',
            variables: true
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const documentName = $.step.parameters.documentName;
        const dataToUpdate = $.step.parameters.dataToUpdate;

        const response = await $.http.patch(`${getFrappeDocumentAPIUrl($, doctype)}/${documentName}`, JSON.parse(dataToUpdate));
        $.setActionItem({ raw: response.data });
    },
})