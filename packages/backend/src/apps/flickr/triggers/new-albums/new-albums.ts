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

const newAlbums = async ($: IGlobalVariable) => {
  let page = 1;
  let pages = 1;

  do {
    const params = {
      page,
      per_page: 500,
      user_id: $.auth.data.userId,
      extras: extraFields,
      method: 'flickr.photosets.getList',
      format: 'json',
      nojsoncallback: 1,
    };
    const response = await $.http.get('/rest', { params });
    const photosets = response.data.photosets;
    page = photosets.page + 1;
    pages = photosets.pages;

    for (const photoset of photosets.photoset) {
      $.pushTriggerItem({
        raw: photoset,
        meta: {
          internalId: photoset.id as string,
        },
      });
    }
  } while (page <= pages);
};

export default newAlbums;
