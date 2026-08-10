import { Buffer } from 'node:buffer';

const getCustomAttributeKey = (attributeName) => {
  const encodedName = Buffer.from(attributeName).toString('base64url');

  return `customAttribute_${encodedName}`;
};

export default getCustomAttributeKey;