import { IGlobalVariable } from '@automatisch/types';

const extraFields = [
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

const newPhotos = async ($: IGlobalVariable) => {
  let page = 1;
  let pages = 1;

  do {
    const params = {
      page,
      per_page: 500,
      user_id: $.auth.data.userId,
      extras: extraFields,
      method: 'flickr.favorites.getList',
      format: 'json',
      nojsoncallback: 1,
    };
    const response = await $.http.get('/rest', { params });
    const photos = response.data.photos;
    page = photos.page + 1;
    pages = photos.pages;

    for (const photo of photos.photo) {
      $.pushTriggerItem({
        raw: photo,
        meta: {
          internalId: photo.date_faved as string,
        },
      });
    }
  } while (page <= pages);
};

export default newPhotos;
