import { URL } from 'node:url';
import { IRequest } from '@automatisch/types';
import { MultiSamlStrategy } from '@node-saml/passport-saml';
import { Express } from 'express';
import passport from 'passport';

import appConfig from '../config/app';
import createAuthTokenByUserId from '../helpers/create-auth-token-by-user-id';
import SamlAuthProvider from '../models/saml-auth-provider.ee';
import findOrCreateUserBySamlIdentity from './find-or-create-user-by-saml-identity.ee'

export default function configurePassport(app: Express) {
  app.use(passport.initialize({
    userProperty: 'currentUser',
  }));

  passport.use(new MultiSamlStrategy(
    {
      passReqToCallback: true,
      getSamlOptions: async function (request, done) {
        const { issuer } = request.params;
        const notFoundIssuer = new Error('Issuer cannot be found!');

        if (!issuer) return done(notFoundIssuer);

        const authProvider = await SamlAuthProvider.query().findOne({
          issuer: request.params.issuer as string,
        });

        if (!authProvider) {
          return done(notFoundIssuer);
        }

        return done(null, authProvider.config);
      },
    },
    async function (request, user: Record<string, unknown>, done) {
      const { issuer } = request.params;
      const notFoundIssuer = new Error('Issuer cannot be found!');

      if (!issuer) return done(notFoundIssuer);

      const authProvider = await SamlAuthProvider.query().findOne({
        issuer: request.params.issuer as string,
      });

      if (!authProvider) {
        return done(notFoundIssuer);
      }

      const foundUserWithIdentity = await findOrCreateUserBySamlIdentity(user, authProvider);
      return done(null, foundUserWithIdentity as unknown as Record<string, unknown>);
    },
    function (request, user: Record<string, unknown>, done: (error: any, user: Record<string, unknown>) => void) {
      return done(null, null);
    }
  ));

  app.get('/login/saml/:issuer',
    passport.authenticate('saml',
      {
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
    (req: IRequest, res) => {
      const token = createAuthTokenByUserId(req.currentUser.id);

      const redirectUrl = new URL(
        `/login/callback?token=${token}`,
        appConfig.webAppUrl,
      ).toString();
      res.redirect(redirectUrl);
    }
  );
};
