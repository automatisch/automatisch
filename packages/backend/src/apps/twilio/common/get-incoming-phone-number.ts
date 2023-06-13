import { IGlobalVariable } from "@automatisch/types";

type Response = {
  sid: string;
  phone_number: string;
};

export default async function getIncomingPhoneNumber($: IGlobalVariable) {
  const phoneNumberSid = $.step.parameters.phoneNumberSid as string;
  const path = `/2010-04-01/Accounts/${$.auth.data.accountSid}/IncomingPhoneNumbers/${phoneNumberSid}.json`;
  const response = await $.http.get<Response>(path);

  return response.data;
};
