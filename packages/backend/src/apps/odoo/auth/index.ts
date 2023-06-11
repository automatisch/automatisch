import verifyCredentials from "./verify-credentials";
import isStillVerified from "./is-still-verified";

export default {
    fields: [
        {
            key: 'hostName',
            label: 'Host Name',
            type: 'string' as const,
            required: true,
            readOnly: false,
            value: null,
            placeholder: null,
            description: 'Host name of your Odoo Server',
            clickToCopy: false,
        },
        {
            key: 'port',
            label: 'Host HTTP Port',
            type: 'string' as const,
            required: false,
            readOnly: false,
            value: null,
            placeholder: null,
            description: 'Port that the host is running on, defaults to 443 (HTTPS)',
            clickToCopy: false,
        },
        {
            key: 'databaseName',
            label: 'Database Name',
            type: 'string' as const,
            required: true,
            readOnly: false,
            value: null,
            placeholder: null,
            description: 'Name of your Odoo Database',
            clickToCopy: false,
        },
        {
            key: 'email',
            label: 'Email Address',
            type: 'string' as const,
            requires: true,
            readOnly: false,
            value: null,
            placeholder: null,
            description: 'Email Address of the account that will be interacting with the Database',
            clickToCopy: false
        },
        {
            key: 'apiKey',
            label: 'API Key',
            type: 'string' as const,
            required: true,
            readOnly: false,
            value: null,
            placeholder: null,
            description: 'API Key for your Odoo account',
            clickToCopy: false
        }
    ],

    verifyCredentials,
    isStillVerified
};