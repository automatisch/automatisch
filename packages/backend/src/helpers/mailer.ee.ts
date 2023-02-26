import nodemailer from 'nodemailer';
import appConfig from '../config/app';

const mailer = nodemailer.createTransport({
  host: appConfig.smtpHost,
  port: appConfig.smtpPort,
  secure: appConfig.smtpSecure,
  auth: {
    user: appConfig.smtpUser,
    pass: appConfig.smtpPassword,
  },
});

export default mailer;
