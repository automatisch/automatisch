import { IGlobalVariable } from '@automatisch/types';

const extractEmailAddress = ($: IGlobalVariable) => {
  const input = $.step.parameters.input as string;
  const emailRegexp =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

  const email = input.match(emailRegexp);
  return email ? email[0] : '';
};

export default extractEmailAddress;
