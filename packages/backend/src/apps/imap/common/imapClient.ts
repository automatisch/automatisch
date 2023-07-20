import { ImapEmails } from 'imap-emails';
import { IGlobalVariable } from '@automatisch/types';

export const imapClient = ($: IGlobalVariable): ImapEmails => {
  return new ImapEmails(
    {
      username: $.auth.data.email as string,
      password: $.auth.data.password as string,
      imapConfig: {
        host: $.auth.data.host as string,
        port: $.auth.data.port as number,
        tls: $.auth.data.useTLS as boolean,
        tlsOptions: {
          host: ($.auth.data.sslHostname ?? $.auth.data.host) as string
        }
      }
    }
  );
}
