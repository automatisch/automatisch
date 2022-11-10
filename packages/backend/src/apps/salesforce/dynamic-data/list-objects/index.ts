import { IGlobalVariable } from '@automatisch/types';

type TResponse = {
  sobjects: TObject[];
};

type TObject = {
  name: string;
  label: string;
};

export default {
  name: 'List objects',
  key: 'listObjects',

  async run($: IGlobalVariable) {
    const response = await $.http.get<TResponse>(
      '/services/data/v56.0/sobjects'
    );

    const objects = response.data.sobjects.map((object) => {
      return {
        value: object.name,
        name: object.label,
      };
    });

    return { data: objects };
  },
};
