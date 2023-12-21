import Context from '../../types/express/context';
import Connection from '../../models/connection';
import SharedConnection from '../../models/shared-connection';

type Params = {
  input: {
    id: string;
    roleIds: string[];
  };
};

const shareConnection = async (
  _parent: unknown,
  params: Params,
  context: Context
) => {
  const conditions = context.currentUser.can('update', 'Connection');

  if (conditions.isCreator) return;

  const {
    id,
    roleIds,
  } = params.input;

  const connection = await Connection
    .query()
    .findById(id)
    .throwIfNotFound();

  try {
    const updatedConnection = await Connection.transaction(async (trx) => {
      await connection.$relatedQuery('sharedConnections', trx).delete();

      if (roleIds?.length) {
        const sharedConnections = roleIds.map((roleId) => ({
          roleId,
          connectionId: connection.id,
        }));

        await SharedConnection.query().insert(sharedConnections);
      }

      return await Connection
        .query(trx)
        .findById(id);
    });

    return updatedConnection;
  } catch (err) {
    throw new Error('The connection sharing preferences could not be updated!');
  }
};

export default shareConnection;
