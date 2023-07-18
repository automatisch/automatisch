import Context from '../../types/express/context';
import Role from '../../models/role';
import Permission from '../../models/permission';

type Params = {
  input: {
    id: string;
    name: string;
    description: string;
    permissions: Permission[];
  };
};

// TODO: access
const updateUser = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const {
    id,
    name,
    description,
    permissions,
  } = params.input;

  const role = await Role.query().findById(id).throwIfNotFound();

  // TODO: delete the unrelated items!
  await role.$relatedQuery('permissions').unrelate();

  // TODO: possibly assert that given permissions do actually exist in catalog
  // TODO: possibly optimize it with patching the different permissions compared to current ones
  return await role.$query()
    .patchAndFetch(
      {
        name,
        description,
        permissions,
      }
    );
};

export default updateUser;
