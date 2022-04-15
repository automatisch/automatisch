import { DateTime } from 'luxon';
import FlickrApi from 'flickr-sdk';
import { IJSONObject } from '@automatisch/types';

export default class NewAlbum {
  client?: typeof FlickrApi;
  connectionData?: IJSONObject;
  primaryPhotoExtraFields = [
    'description',
    'license',
    'date_upload',
    'date_taken',
    'owner_name',
    'icon_server',
    'original_format',
    'last_update',
    'geo',
    'tags',
    'machine_tags',
    'o_dims',
    'views',
    'media',
    'path_alias',
    'url_sq',
    'url_t',
    'url_s',
    'url_q',
    'url_m',
    'url_n',
    'url_z',
    'url_c',
    'url_l',
    'url_o',
  ].join(',');

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

      this.connectionData = connectionData;
    }
  }

  async getAlbums(options: { perPage?: number, page?: number } = {}) {
    const { perPage, page } = options;
    const payload = {
      page,
      per_page: perPage,
      primary_photo_extras: this.primaryPhotoExtraFields,
    };
    const { photosets } = (await this.client.photosets.getList(payload)).body;

    return photosets;
  }

  async run(startTime: Date) {
    const albums = await this.getAlbums({ page: 1 });
    const allAlbums = [...albums.photoset];
    const newAlbums = [];

    let page = 1;
    for (const album of allAlbums) {
      const createdAtInSeconds = DateTime.fromSeconds(parseInt(album.date_create, 10));
      const createdAt = createdAtInSeconds.toMillis();

      if (createdAt <= startTime.getTime()) {
        break;
      }

      newAlbums.push(album);

      const currentIndex = allAlbums.indexOf(album);
      const totalAlbums = allAlbums.length;
      const isLastItem = currentIndex + 1 === totalAlbums;

      if (isLastItem && page < albums.pages) {
        page = page + 1;
        const { photoset } = await this.getAlbums({ page, });
        allAlbums.push(...photoset.photoset);
      }
    }

    return newAlbums;
  }

  async testRun() {
    const { photoset } = await this.getAlbums({ perPage: 1 });

    return photoset;
  }
}
