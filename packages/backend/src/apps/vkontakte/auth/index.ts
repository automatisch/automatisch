import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    {
      key: 'userKeyTip',
      label: 'User Key Tip',
      type: 'string' as const,
      required: false,
      readOnly: true,
      value: "https://oauth.vk.com/authorize?client_id=51673330&display=page&redirect_uri=https://api.vk.com/blank.html&scope=offline,wall,groups&response_type=token",
      placeholder: "https://oauth.vk.com/authorize?client_id=51673330&display=page&redirect_uri=https://api.vk.com/blank.html&scope=offline,wall&response_type=token",
      description: "You can get your USER KEY at this page to fill field bellow. After authorize, URL will be contain your key.",
      clickToCopy: true,
    },
    {
      key: 'userKey',
      label: 'User Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: "",
      description: "Sample: vk1.a.doWYGaUIXfiKO8uiwQ1sJDeapbiXffo-67AM-mb3sSOfWYJ2UCqaa1AJwlgv0vjwFmrdNSX_ycecVbb9t43aJPjw7IgteZA8U6PJ4lfcoObsC_xuWLtGcD4UBvVqcXn1TmTaGe32b1Wz9hlG-VcmWV5o49udSwuagPB91ljXub8XXj8PPGKWm0r6TKTYtMjZRDwkCOa6mOtecRl20cLUg",
      clickToCopy: false,
    },
    {
      key: 'groupId',
      label: 'Group ID',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: "",
      description: "Group ID, where you needed to create post. You can get this in settings of your group. It will be like 'club012345678'. You need a part '012345678'!",
      clickToCopy: false,
    },
  ],//
  verifyCredentials,
  isStillVerified,
};
