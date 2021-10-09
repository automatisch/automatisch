import App from '../../models/app';

const getApp = (name: string) => {
  if(!name) {
    throw new Error('No name provided.')
  }

  return App.findOneByName(name)
}

export default getApp;
