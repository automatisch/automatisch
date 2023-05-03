import { IGlobalVariable } from '@automatisch/types';
import logger from '../../../helpers/logger';
import setConfig from '../common/postgres-configuration';


const verifyCredentials = async ($: IGlobalVariable) => {

    const pgClient = await setConfig($)
    const checkConnection = await pgClient.raw('SELECT 1')
    logger.debug(checkConnection)

    await $.auth.set({
        screenName: `${$.auth.data.database} DB`,
        client: 'pg',
        version: $.auth.data.version,
        host : $.auth.data.host,
        port : $.auth.data.port,
        user : $.auth.data.user,
        password : $.auth.data.password,
        database : $.auth.data.database
    });
};

export default verifyCredentials;


/*

mutation Login($input: LoginInput) {  login(input: $input) {    token    user {      id      email      __typename    }    __typename  }}


mutation CreateConnection($input: CreateConnectionInput) {  createConnection(input: $input) {    id    key    verified    formattedData {      screenName      __typename    }    __typename  }}

{
    "input":
    {
        "key": "postgres",
        "formattedData": {
            "version":"15",
            "host":"127.0.0.1",
            "port":"6500",
            "database":"bbs",
            "user":"test",
            "password":"@Test123"        
        }
    }
}

mutation VerifyConnection($input: VerifyConnectionInput) {  verifyConnection(input: $input) {    id    key    verified    formattedData {      screenName      __typename    }    createdAt    app {      key      __typename    }    __typename  }}


{
    "input":
{"id": "18309778-ef78-41ae-be1b-ff51781134c0"}
}

*/