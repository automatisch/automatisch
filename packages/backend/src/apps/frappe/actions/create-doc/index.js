import defineAction from '../../../../helpers/define-action.js';
import { getDocumentAPIBase } from '../../common/utils.js';

export default defineAction({
    name: 'Create New Document',
    key: 'createDoc',
    description: 'Creates a new document in Frappe.',
    arguments: [
        {
            label: 'Document Type',
            key: 'doctype',
            description: 'The type of the document to create.',
            type: 'dropdown',
            required: true,
            variables: true,
            source: {
                type: 'query',
                name: 'getDynamicData',
                arguments: [
                    {
                        name: 'key',
                        value: 'listDoctypes',
                    },
                ],
            },
        },
        {
            label: 'Document Data',
            key: 'documentData',
            type: 'string',
            required: true,
            description: 'The data for the new document. This should be a JSON object containing the fields and their values.',
            variables: false,
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const documentData = $.step.parameters.documentData;
        const response = await $.http.post(getDocumentAPIBase($, doctype), JSON.parse(documentData));

        $.setActionItem({ raw: response.data });
    },
})