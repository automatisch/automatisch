import AuthenticationStepField from '../types/authentication-step-field';

type AuthenticationStep = {
  step: number,
  type: string,
  name: string,
  fields: AuthenticationStepField[];
}

export default AuthenticationStep;
