import defineAction from '../../../../helpers/define-action';
import asyncMethodCall from "../../async-XMLRPC-client";
import xmlrpc from "xmlrpc";

export default defineAction({
    name: "Create Lead",
    key: "odooCreateLead",
    description: "",
    arguments: [
        {
            label: 'Name',
            key: 'name',
            type: 'string' as const,
            required: true,
            description: 'Name of the lead object',
            variables: true,
        },
        {
            label: 'Lead\'s Email',
            key: 'email',
            type: 'string' as const,
            required: false,
            description: 'Email of lead contact',
            variables: true,
        },
        {
            label: 'Lead\'s Name',
            key: 'contactName',
            type: 'string' as const,
            required: false,
            description: 'Name of lead contact',
            variables: true
        },
        {
            label: 'Phone Number',
            key: 'phoneNumber',
            type: 'string' as const,
            required: false,
            description: 'Phone number of lead contact',
            variables: true
        },
        {
            label: 'Mobile Number',
            key: 'mobileNumber',
            type: 'string' as const,
            required: false,
            description: 'Mobile number of lead contact',
            variables: true
        }
    ],

    async run($) {
        const port = $.auth.data.port ? parseInt($.auth.data.port.toString()) : 443;
        const authClient = await xmlrpc.createClient(
            {
                host: $.auth.data.hostName.toString(),
                port: port,
                path: "/xmlrpc/2/common",
            }
        );

        const uid = await asyncMethodCall(
            authClient,
            "authenticate",
            [
                $.auth.data.databaseName,
                $.auth.data.email,
                $.auth.data.apiKey,
                []
            ]
        );

        const objectClient = await xmlrpc.createClient(
            {
                host: $.auth.data.hostName.toString(),
                port: port,
                path: "/xmlrpc/2/object"
            }
        )

        const leadID = await asyncMethodCall(
            objectClient,
            "execute_kw",
            [
                $.auth.data.databaseName,
                parseInt(uid.toString()),
                $.auth.data.apiKey,
                "crm.lead",
                "create",
                [
                    {
                        name: $.step.parameters.name,
                        type: "lead",
                        email_from: $.step.parameters.email,
                        contact_name: $.step.parameters.contactName,
                        phone: $.step.parameters.phoneNumber,
                        mobile: $.step.parameters.mobileNumber
                    }
                ]
            ]
        );

    $.setActionItem(
      {
        raw: {
          leadID
        }
      }
    )
  }
});
