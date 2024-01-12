export default function parseLinkHeader(link) {
  const parsed = {};

  if (!link) return parsed;

  const items = link.split(',');

  for (const item of items) {
    const [rawUriReference, ...rawLinkParameters] = item.split(';');
    const trimmedUriReference = rawUriReference.trim();

    const reference = trimmedUriReference.slice(1, -1);
    const parameters = {};

    for (const rawParameter of rawLinkParameters) {
      const trimmedRawParameter = rawParameter.trim();
      const [key, value] = trimmedRawParameter.split('=');

      parameters[key.trim()] = value.slice(1, -1);
    }

    parsed[parameters.rel] = {
      uri: reference,
      parameters,
    };
  }

  return parsed;
}
