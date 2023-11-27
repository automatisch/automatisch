import { IJSONObject } from '@automatisch/types';
import defineAction from '../../../../helpers/define-action';
import { fields } from './fields';

type Payload = {
  user: IJSONObject;
};

export default defineAction({
  name: 'Update user',
  key: 'updateUser',
  description: 'Modifies an already existing user.',
  arguments: fields,

  async run($) {
    const {
      userId,
      name,
      email,
      details,
      notes,
      phone,
      role,
      organizationId,
      externalId,
      verified,
    } = $.step.parameters;

    const tags = $.step.parameters.tags as string;
    const formattedTags = tags.split(',');

    const payload: Payload = {
      user: {
        name,
        email,
        details,
        notes,
        phone,
        organization_id: organizationId,
        external_id: externalId,
        verified: verified || 'false',
        tags: formattedTags,
      },
    };

    if (role) {
      payload.user.role = role;
    }

    const response = await $.http.put(`/api/v2/users/${userId}`, payload);

    $.setActionItem({ raw: response.data });
  },
});
