import type { IAuthenticationStepField } from '@automatisch/types';

type AuthenticationStep = {
  step: number;
  type: string;
  name: string;
  fields: IAuthenticationStepField[];
};

export default AuthenticationStep;
