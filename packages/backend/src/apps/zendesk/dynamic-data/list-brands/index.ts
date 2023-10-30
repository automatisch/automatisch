import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List brands',
  key: 'listBrands',

  async run($: IGlobalVariable) {
    const brands: {
      data: IJSONObject[];
    } = {
      data: [],
    };

    const params = {
      page: 1,
      per_page: 100,
    };

    let nextPage;
    do {
      const response = await $.http.get('/api/v2/brands', { params });
      const allBrands = response?.data?.brands;
      nextPage = response.data.next_page;
      params.page = params.page + 1;

      if (allBrands?.length) {
        for (const brand of allBrands) {
          brands.data.push({
            value: brand.id,
            name: brand.name,
          });
        }
      }
    } while (nextPage);

    return brands;
  },
};
