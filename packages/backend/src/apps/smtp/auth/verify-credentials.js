import transporter from '../common/transporter.js';

const verifyCredentials = async ($) => {
  await transporter($).verify();

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
