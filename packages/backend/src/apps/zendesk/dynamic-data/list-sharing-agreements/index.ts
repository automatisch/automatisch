import { IGlobalVariable, IJSONObject } from '@automatisch/types';

export default {
  name: 'List sharing agreements',
  key: 'listSharingAgreements',

  async run($: IGlobalVariable) {
    const sharingAgreements: {
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
      const response = await $.http.get('/api/v2/sharing_agreements', {
        params,
      });
      const allSharingAgreements = response?.data?.sharing_agreements;
      nextPage = response.data.next_page;
      params.page = params.page + 1;

      if (allSharingAgreements?.length) {
        for (const sharingAgreement of allSharingAgreements) {
          sharingAgreements.data.push({
            value: sharingAgreement.id,
            name: sharingAgreement.name,
          });
        }
      }
    } while (nextPage);

    return sharingAgreements;
  },
};
