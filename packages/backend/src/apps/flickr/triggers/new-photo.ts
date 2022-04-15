import { DateTime } from 'luxon';
import FlickrApi from 'flickr-sdk';
import { IJSONObject } from '@automatisch/types';

export default class NewPhoto {
  client?: typeof FlickrApi;
  connectionData?: IJSONObject;
  extraFields = [
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

  async getPhotos(options: { perPage?: number, page?: number, minUploadDate?: string } = {}) {
    const { perPage, page, minUploadDate } = options;
    const payload = {
      page,
      per_page: perPage,
      user_id: this.connectionData.userId,
      extras: this.extraFields,
      min_upload_date: minUploadDate,
    };
    const { photos } = (await this.client.photos.search(payload)).body;

    return photos;
  }

  async run(startTime: Date) {
    const minUploadDate = DateTime.fromJSDate(startTime).toSeconds().toString();
    const photos = await this.getPhotos({ page: 1, minUploadDate });
    const allPhotos = [...photos.photo];

    for (let page = photos.page + 1; page <= photos.pages; page++) {
      const photos = (await this.getPhotos({ page, minUploadDate }));
      allPhotos.push(...photos.photo);
    }

    return allPhotos;
  }

  async testRun(startTime: Date) {
    const { photo } = await this.getPhotos({ perPage: 1 });

    return photo;
  }
}
