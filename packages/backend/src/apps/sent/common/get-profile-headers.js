/**
 * Builds the optional `x-profile-id` header. The header is only sent when a
 * sender profile has been selected, because Sent rejects it for non-organization
 * API keys and treats an empty value as invalid.
 */
const getProfileHeaders = (senderProfileId) => {
  const profileId =
    typeof senderProfileId === 'string' ? senderProfileId.trim() : '';

  if (!profileId) return {};

  return { 'x-profile-id': profileId };
};

export default getProfileHeaders;
