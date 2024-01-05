export default {
  name: 'List albums',
  key: 'listAlbums',

  async run($) {
    const params = {
      page: 1,
      per_page: 500,
      user_id: $.auth.data.userId,
      method: 'flickr.photosets.getList',
      format: 'json',
      nojsoncallback: 1,
    };

    let response = await $.http.get('/rest', { params });

    const aggregatedResponse = {
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

    aggregatedResponse.data = aggregatedResponse.data.map((photoset) => {
      return {
        value: photoset.id,
        name: photoset.title._content,
      };
    });

    return aggregatedResponse;
  },
};
