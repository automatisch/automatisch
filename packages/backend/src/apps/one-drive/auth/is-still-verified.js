import getDrive from '../common/get-drive.js';

const isStillVerified = async ($) => {
  const drive = await getDrive($);
  return !!drive.id;
};

export default isStillVerified;
