import xmlrpc from 'xmlrpc';

const asyncMethodCall = async(client: xmlrpc.Client, method: string, params: any[]) => {
    return new Promise(
        (resolve, reject) => {
            client.methodCall(
                method,
                params,
                (error, response) => {
                    if (error != null) {
                        // something went wrong on the server side, display the error returned by Odoo
                        reject(error);
                    }

                    resolve(response);
                }
            )
        }
    );
}

export default asyncMethodCall
