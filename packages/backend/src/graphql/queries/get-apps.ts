import App from '../../models/app';

const getApps = () => {
  return App.findAll()
}

export default getApps;
