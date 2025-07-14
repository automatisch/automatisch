import nodemailer from 'nodemailer';

const transporter = ($) => {
  const transportOptions = {
    host: $.auth.data.host,
    port: $.auth.data.port,
    secure: $.auth.data.useTls,
  };

  if ($.auth.data.username || $.auth.data.password) {
    transportOptions.auth = {
      user: $.auth.data.username,
      pass: $.auth.data.password,
    };
  }

  return nodemailer.createTransport(transportOptions);
};

export default transporter;
