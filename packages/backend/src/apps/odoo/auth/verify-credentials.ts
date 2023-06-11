import xmlrpc from 'xmlrpc';
import {IGlobalVariable} from "@automatisch/types";

const verifyCredentials = async ($: IGlobalVariable) => {
    let port = $.auth.data.port ? parseInt($.auth.data.port.toString()) : 443;
    let client = await xmlrpc.createClient(
        {
            host: $.auth.data.hostName.toString(),
            port: port,
            path: "/xmlrpc/2/common",
        }
    );

    await client.methodCall(
        "authenticate",
        [
            $.auth.data.databaseName,
            $.auth.data.email,
            $.auth.data.apiKey,
            []
        ],
        async function (error, value) {
            if (error != null) {
                // something went wrong on the server side, display the error returned by Odoo
                throw error;
            }

            if (!Number.isInteger(value)) {
                // failed to authenticate
                throw new Error(
                    "Failed to connect to the Odoo server, check Odoo credentials"
                );
            }

            await $.auth.set({
                screenName: `${$.auth.data.hostName} - ${$.auth.data.databaseName} - ${$.auth.data.email}`,
                uid: value
            });
        }
    )
}

export default verifyCredentials;
