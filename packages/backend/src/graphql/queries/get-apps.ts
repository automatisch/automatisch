import App from '../../models/app';

const getApps = (name: string) => {
  return App.findAll(name)
}

export default getApps;
