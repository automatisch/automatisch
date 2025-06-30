import defineAction from '../../../../helpers/define-action.js';
import { getDocumentAPIBase } from '../../common/utils.js';

export default defineAction({
    name: 'Update Existing Document',
    key: 'updateDoc',
    description: 'Updates an existing document in Frappe.',
    arguments: [
        {
            label: 'Document Type',
            key: 'doctype',
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
            label: 'Document Name',
            key: 'documentName',
            type: 'string',
            required: true,
            description: 'The name of the document to update.',
            variables: false,
        },
        {
            label: 'Document Data',
            key: 'dataToUpdate',
            type: 'string',
            required: true,
            description: 'This should be a JSON object containing the fields to update and their values.',
            variables: false
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const documentName = $.step.parameters.documentName;
        const dataToUpdate = $.step.parameters.dataToUpdate;

        const response = await $.http.patch(`${getDocumentAPIBase($, doctype)}/${documentName}`, JSON.parse(dataToUpdate));
        $.setActionItem({ raw: response.data });
    },
})