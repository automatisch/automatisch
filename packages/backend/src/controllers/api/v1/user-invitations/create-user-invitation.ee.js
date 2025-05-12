import { renderObject } from '../../../../helpers/renderer.js';
import User from '../../../../models/user.js';

/**
 * @openapi
 * /user-invitations:
 *   post:
 *     summary: Create user invitation
 *     description: Sends a new user invitation.
 *     security:
 *      - ApiKeyAuth: []
 *     tags:
 *       - User Invitations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - roleId
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the invited user
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the invited user
 *               roleId:
 *                 type: string
 *                 format: uuid
 *                 description: Role ID to assign to the invited user
 *     responses:
 *       201:
 *         description: User invitation created successfully
 */
export default async (request, response) => {
  const user = await User.query().insertAndFetch(userParams(request));
  await user.sendInvitationEmail();

  renderObject(response, user, {
    status: 201,
    serializer: 'PublicUserInvitation',
  });
};

const userParams = (request) => {
  const { fullName, email, roleId } = request.body;

  return {
    fullName,
    status: 'invited',
    email: email?.toLowerCase(),
    roleId,
  };
};
