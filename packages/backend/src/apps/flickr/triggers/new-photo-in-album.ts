import { DateTime } from 'luxon';
import FlickrApi from 'flickr-sdk';
import { IJSONObject } from '@automatisch/types';

export default class NewPhotoInAlbum {
  client?: typeof FlickrApi;
  connectionData?: IJSONObject;
  albumId?: string;
  extraFields = [
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
    'url_m',
    'url_o'
  ].join(',');

  constructor(connectionData: IJSONObject, parameters: IJSONObject) {
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

    if (parameters?.album) {
      this.albumId = parameters.album as string;
    }
  }

  async getAlbumPhotos(options: { perPage?: number, page?: number } = {}) {
    const { perPage, page } = options;
    const payload = {
      page,
      per_page: perPage,
      photoset_id: this.albumId,
      user_id: this.connectionData.userId,
      extras: this.extraFields,
    };
    const { photoset } = (await this.client.photosets.getPhotos(payload)).body;

    return photoset;
  }

  async run() {
    // TODO: implement pagination on undated entries
    const { photo } = await this.getAlbumPhotos({ page: 1 });

    return photo;
  }

  async testRun() {
    const { photo } = await this.getAlbumPhotos({ perPage: 1 });

    return photo;
  }
}
