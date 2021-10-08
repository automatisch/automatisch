import App from '../../models/app';

type Params = {
  name: string
}

const getAppsByName = (params: Params) => {
  return App.findAllByName(params.name)
}

export default getAppsByName;
