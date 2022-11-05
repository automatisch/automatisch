import FieldType from './field';
import AuthenticationStepType from './authentication-step';

type AppInfo = {
  name: string;
  key: string;
  iconUrl: string;
  docUrl: string;
  primaryColor: string;
  fields: FieldType[];
  authenticationSteps?: AuthenticationStepType[];
};

export default AppInfo;
