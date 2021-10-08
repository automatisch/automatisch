import App from '../../models/app';

type Params = {
  name: string
}

const getApps = (params: Params) => {
  return App.findAll(params.name)
}

export default getApps;
