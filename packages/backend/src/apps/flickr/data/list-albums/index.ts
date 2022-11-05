import { IGlobalVariable, IJSONObject } from '@automatisch/types';

type TResponse = {
  data: IJSONObject[];
  error?: IJSONObject;
};

type TPhotoset = {
  id: string;
  title: {
    _content: string;
  };
};

export default {
  name: 'List albums',
  key: 'listAlbums',

  async run($: IGlobalVariable) {
    const params = {
      page: 1,
      per_page: 500,
      user_id: $.auth.data.userId,
      method: 'flickr.photosets.getList',
      format: 'json',
      nojsoncallback: 1,
    };
    let response = await $.http.get('/rest', { params });

    const aggregatedResponse: TResponse = {
      data: [...response.data.photosets.photoset],
    };

    while (response.data.photosets.page < response.data.photosets.pages) {
      response = await $.http.get('/rest', {
        params: {
          ...params,
          page: response.data.photosets.page,
        },
      });

      aggregatedResponse.data.push(...response.data.photosets.photoset);
    }

    aggregatedResponse.data = aggregatedResponse.data.map(
      (photoset: TPhotoset) => {
        return {
          value: photoset.id,
          name: photoset.title._content,
        } as IJSONObject;
      }
    );

    return aggregatedResponse;
  },
};
