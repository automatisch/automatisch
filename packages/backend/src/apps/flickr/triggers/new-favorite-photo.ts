import { DateTime } from 'luxon';
import FlickrApi from 'flickr-sdk';
import { IJSONObject } from '@automatisch/types';

export default class NewFavoritePhoto {
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

  async run(startTime: Date) {
    const { photos } = (await this.client.favorites.getList()).body;
    const favPhotos = [...photos.photo];
    const newFavPhotos = [];

    let page = 1;
    for (const photo of favPhotos) {
      const markedFavoriteAt = DateTime.fromSeconds(parseInt(photo.date_faved, 10));
      const markedFavoriteAtInMillis = markedFavoriteAt.toMillis();

      if (markedFavoriteAtInMillis <= startTime.getTime()) {
        break;
      }

      newFavPhotos.push(photo);

      const currentIndex = favPhotos.indexOf(photo);
      const totalFavPhotos = favPhotos.length;
      const isLastItem = currentIndex + 1 === totalFavPhotos;

      if (isLastItem && page < photos.pages) {
        page = page + 1;
        const { photos } = (await this.client.favorites.getList({ page, })).body;
        favPhotos.push(...photos.photo);
      }
    }

    return newFavPhotos;
  }

  async testRun() {
    const { photos } = (await this.client.favorites.getList({ per_page: 1, })).body;

    return photos.photo;
  }
}

