import { URL } from 'node:url';
import { MultiSamlStrategy } from '@node-saml/passport-saml';
import passport from 'passport';

import appConfig from '../config/app.js';
import createAuthTokenByUserId from './create-auth-token-by-user-id.js';
import SamlAuthProvider from '../models/saml-auth-provider.ee.js';
import AccessToken from '../models/access-token.js';
import findOrCreateUserBySamlIdentity from './find-or-create-user-by-saml-identity.ee.js';

const asyncNoop = async () => { };

export default function configurePassport(app) {
  app.use(
    passport.initialize({
      userProperty: 'currentUser',
    })
  );

  passport.use(
    new MultiSamlStrategy(
      {
        passReqToCallback: true,
        getSamlOptions: async function (request, done) {
          // This is a workaround to avoid session logout which passport-saml enforces
          request.logout = asyncNoop;
          request.logOut = asyncNoop;

          const { issuer } = request.params;
          const notFoundIssuer = new Error('Issuer cannot be found!');

          if (!issuer) return done(notFoundIssuer);

          const authProvider = await SamlAuthProvider.query().findOne({
            issuer: request.params.issuer,
          });

          if (!authProvider) {
            return done(notFoundIssuer);
          }

          return done(null, authProvider.config);
        },
      },
      async function signonVerify(request, user, done) {
        const { issuer } = request.params;
        const notFoundIssuer = new Error('Issuer cannot be found!');

        if (!issuer) return done(notFoundIssuer);

        const authProvider = await SamlAuthProvider.query().findOne({
          issuer: request.params.issuer,
        });

        if (!authProvider) {
          return done(notFoundIssuer);
        }

        const foundUserWithIdentity = await findOrCreateUserBySamlIdentity(
          user,
          authProvider
        );

        request.samlSessionId = user.sessionIndex;

        return done(null, foundUserWithIdentity);
      },
      async function logoutVerify(request, user, done) {
        const { issuer } = request.params;
        const notFoundIssuer = new Error('Issuer cannot be found!');

        if (!issuer) return done(notFoundIssuer);

        const authProvider = await SamlAuthProvider.query().findOne({
          issuer: request.params.issuer,
        });

        if (!authProvider) {
          return done(notFoundIssuer);
        }

        const foundUserWithIdentity = await findOrCreateUserBySamlIdentity(
          user,
          authProvider
        );

        const accessToken = await AccessToken.query().findOne({
          revoked_at: null,
          saml_session_id: user.sessionIndex,
        }).throwIfNotFound();

        await accessToken.revoke();

        return done(null, foundUserWithIdentity);
      }
    )
  );

  app.get(
    '/login/saml/:issuer',
    passport.authenticate('saml', {
      session: false,
      successRedirect: '/',
    })
  );

  app.post(
    '/login/saml/:issuer/callback',
    passport.authenticate('saml', {
      session: false,
    }),
    async (request, response) => {
      const token = await createAuthTokenByUserId(request.currentUser.id, request.samlSessionId);

      const redirectUrl = new URL(
        `/login/callback?token=${token}`,
        appConfig.webAppUrl
      ).toString();
      response.redirect(redirectUrl);
    }
  );

  app.post(
    '/logout/saml/:issuer',
    passport.authenticate('saml', {
      session: false,
    }),
  );
}
