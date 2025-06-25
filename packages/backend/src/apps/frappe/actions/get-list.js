import defineAction from '../../../helpers/define-action.js';
import { getFrappeDocumentAPIUrl } from '../common/utils.js';

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
        },
        {
            label: 'Fields',
            key: 'fields',
            type: 'string',
            required: false,
            description: 'List of fields to retrieve for each document. Use * to retrieve all fields.',
            variables: true,
        },
        {
            label: 'Filters',
            key: 'filters',
            type: 'string',
            required: false,
            description: 'Filters to apply to the document list. Provide a JSON string with field-value pairs.',
            variables: true,
        },
        {
            label: 'Limit',
            key: 'limit',
            type: 'string',
            required: false,
            description: 'Maximum number of documents to retrieve. Defaults to 20.',
            default: 20,
            variables: true,
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
    
        const response = await $.http.get(`${getFrappeDocumentAPIUrl($, doctype)}?${params.toString()}`);

        $.setActionItem({ raw: response.data });
    },
})