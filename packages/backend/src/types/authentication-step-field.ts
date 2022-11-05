type AuthenticationStepField = {
  name: string;
  value: string | null;
  fields?: {
    name: string;
    value: string | null;
  }[];
};

export default AuthenticationStepField;
