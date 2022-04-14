import FlickrApi from 'flickr-sdk';
import type { IJSONObject } from '@automatisch/types';

export default class ListAlbums {
  client?: typeof FlickrApi;

  constructor(connectionData: IJSONObject) {
    if (
      connectionData.consumerKey &&
      connectionData.consumerSecret &&
      connectionData.accessToken &&
      connectionData.accessSecret
    ) {
      this.client = new FlickrApi(
        FlickrApi.OAuth.createPlugin(
          connectionData.consumerKey,
          connectionData.consumerSecret,
          connectionData.accessToken,
          connectionData.accessSecret
        )
      );
    }
  }

  async run() {
    const { photosets } = (await this.client.photosets.getList()).body;
    const allPhotosets = [...photosets.photoset];

    for (let page = photosets.page + 1; page <= photosets.pages; page++) {
      const { photosets } = (await this.client.photosets.getList({ page, })).body;
      allPhotosets.push(...photosets.photoset);
    }

    return allPhotosets.map((photoset) => ({
      value: photoset.id,
      name: photoset.title._content,
    }));
  }
}
