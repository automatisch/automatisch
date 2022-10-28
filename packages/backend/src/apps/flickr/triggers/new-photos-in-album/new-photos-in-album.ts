import { IGlobalVariable } from '@automatisch/types';

const extraFields = [
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
  'url_o',
].join(',');

const newPhotosInAlbum = async ($: IGlobalVariable) => {
  let page = 1;
  let pages = 1;

  do {
    const params = {
      page,
      per_page: 11,
      user_id: $.auth.data.userId,
      extras: extraFields,
      photoset_id: $.step.parameters.album as string,
      method: 'flickr.photosets.getPhotos',
      format: 'json',
      nojsoncallback: 1,
    };
    const response = await $.http.get('/rest', { params });
    const photoset = response.data.photoset;
    page = photoset.page + 1;
    pages = photoset.pages;

    for (const photo of photoset.photo) {
      $.pushTriggerItem({
        raw: photo,
        meta: {
          internalId: photo.id as string,
        },
      });
    }
  } while (page <= pages);
};

export default newPhotosInAlbum;
