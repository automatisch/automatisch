const { AdminCreateUserPage } = require('../../fixtures/admin/create-user-page');
const { publicTest, expect } = require('../../fixtures/index');
const { client } = require('../../fixtures/postgres-client-config');
const { DateTime } = require('luxon');

publicTest.describe('Accept invitation page', () => {
  publicTest.beforeAll(async () => {
    await client.connect();
  });

  publicTest.afterAll(async () => {
    await client.end();
  });

  publicTest('should not be able to set the password if token is empty', async ({ acceptInvitationPage }) => {
    await acceptInvitationPage.open('');
    await acceptInvitationPage.excpectSubmitButtonToBeDisabled();
    await acceptInvitationPage.fillPasswordField('something');
    await acceptInvitationPage.excpectSubmitButtonToBeDisabled();
  });

  publicTest('should not be able to set the password if token is expired', async ({ acceptInvitationPage, page }) => {
    const expiredTokenDate = DateTime.now().minus({days: 3}).toISO();
    const expiredToken = (Math.random() + 1).toString(36).substring(2);

    const adminCreateUserPage = new AdminCreateUserPage(page);
    adminCreateUserPage.seed(Math.ceil(Math.random() * Number.MAX_SAFE_INTEGER));
    const user = adminCreateUserPage.generateUser();

    const queryRole = {
      text: 'SELECT * FROM roles WHERE name = $1',
      values: ['Admin']
    };

    try {
      const queryRoleIdResult = await client.query(queryRole);
      expect(queryRoleIdResult.rowCount).toEqual(1);

      const insertUser = {
        text: 'INSERT INTO users (email, full_name, role_id, status, invitation_token, invitation_token_sent_at) VALUES ($1, $2, $3, $4, $5, $6)',
        values: [user.email, user.fullName, queryRoleIdResult.rows[0].id, 'invited', expiredToken, expiredTokenDate],
      };

      const insertUserResult = await client.query(insertUser);
      expect(insertUserResult.rowCount).toBe(1);
      expect(insertUserResult.command).toBe('INSERT');
    } catch (err) {
      console.error(err.message);
      throw err;
    }

    await acceptInvitationPage.open(expiredToken);
    await acceptInvitationPage.acceptInvitation('something');
    await acceptInvitationPage.expectAlertToBeVisible();
  });

  publicTest('should not be able to set the password if token is not in db', async ({ acceptInvitationPage }) => {
    await acceptInvitationPage.open('abc');
    await acceptInvitationPage.acceptInvitation('something');
    await acceptInvitationPage.expectAlertToBeVisible();
  });
});
