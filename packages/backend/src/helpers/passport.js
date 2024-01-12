import { URL } from 'node:url';
import { MultiSamlStrategy } from '@node-saml/passport-saml';
import passport from 'passport';

import appConfig from '../config/app.js';
import createAuthTokenByUserId from './create-auth-token-by-user-id.js';
import SamlAuthProvider from '../models/saml-auth-provider.ee.js';
import findOrCreateUserBySamlIdentity from './find-or-create-user-by-saml-identity.ee.js';

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
      async function (request, user, done) {
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
        return done(null, foundUserWithIdentity);
      },
      function (request, user, done) {
        return done(null, null);
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
      failureRedirect: '/',
      failureFlash: true,
    }),
    (req, res) => {
      const token = createAuthTokenByUserId(req.currentUser.id);

      const redirectUrl = new URL(
        `/login/callback?token=${token}`,
        appConfig.webAppUrl
      ).toString();
      res.redirect(redirectUrl);
    }
  );
}
