import defineTrigger from '../../../../helpers/define-trigger';
import { imapClient } from '../../common/imapClient';
import { ParsedMail } from 'mailparser';

export default defineTrigger({
  name: 'New Email',
  key: 'smtpNewEmail',
  pollInterval: 15,
  description: 'Triggers when an email has been received',

  async run($) {
    const imapEmails = imapClient($);

    await imapEmails.connect();

    // node-imap ignores times and timezones, so just use the current date
    const emails = await imapEmails.getEmails({
      since: new Date(),
    });

    const totalEmails = emails.length;
    let parsedEmail: ParsedMail;
    for (let emailIndex = totalEmails - 1; emailIndex >= 0; emailIndex--) {
      // emails need to be parsed in reverse-chronological order due to the way the trigger works
      // https://automatisch.io/docs/build-integrations/triggers
      parsedEmail = emails[emailIndex];

      const addresses: string[] = [];
      parsedEmail.from.value.forEach(function(address) {
        addresses.push(address.address);
      });

      $.pushTriggerItem(
        {
          raw: {
            from: addresses,
            subject: parsedEmail.subject,
            html: parsedEmail.html,
            text: parsedEmail.text
          },
          meta: {
            internalId: parsedEmail.messageId
          }
        }
      );
    }
  },
});