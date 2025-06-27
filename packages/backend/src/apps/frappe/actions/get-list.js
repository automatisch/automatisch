import defineAction from '../../../helpers/define-action.js';
import { getDocumentAPIBase } from '../common/utils.js';

export default defineAction({
    name: 'Get Document List',
    key: 'getList',
    description: 'Gets a list of documents from Frappe.',
    arguments: [
        {
            label: 'Document Type',
            key: 'doctype',
            type: 'string',
            required: true,
            description: 'The type of the doctype to retrieve the list for.',
            variables: false,
        },
        {
            label: 'Fields',
            key: 'fields',
            type: 'string',
            required: false,
            description: 'List of fields to retrieve for each document. Use * to retrieve all fields.',
            variables: false,
        },
        {
            label: 'Filters',
            key: 'filters',
            type: 'string',
            required: false,
            description: 'Filters to apply to the document list. Provide a JSON string with field-value pairs.',
            variables: false,
        },
        {
            label: 'Limit',
            key: 'limit',
            type: 'string',
            required: false,
            description: 'Maximum number of documents to retrieve. Defaults to 20.',
            default: 20,
            variables: false,
        }
    ],

    async run($) {
        const doctype = $.step.parameters.doctype;
        const fields = $.step.parameters.fields;
        const filters = $.step.parameters.filters ? JSON.parse($.step.parameters.filters) : {};
        const limit = Number.parseInt($.step.parameters.limit) || 20;
        
        const params = new URLSearchParams();

        if (fields) {
            params.append('fields', fields);
        }

        if (filters) {
            params.append('filters', JSON.stringify(filters));
        }

        params.append('limit', limit);
    
        const response = await $.http.get(`${getDocumentAPIBase($, doctype)}?${params.toString()}`);

        $.setActionItem({ raw: response.data });
    },
})