export default async function getIncomingPhoneNumber($) {
  const phoneNumberSid = $.step.parameters.phoneNumberSid;
  const path = `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/${phoneNumberSid}.json`;
  const response = await $.http.get(path);

  return response.data;
}
