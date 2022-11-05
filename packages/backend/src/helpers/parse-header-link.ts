type TParameters = {
  [key: string]: string;
  rel?: string;
};

type TReference = {
  uri: string;
  parameters: TParameters;
};

type TRel = 'next' | 'prev' | 'first' | 'last';

type TParsedLinkHeader = {
  next?: TReference;
  prev?: TReference;
  first?: TReference;
  last?: TReference;
};

export default function parseLinkHeader(link: string): TParsedLinkHeader {
  const parsed: TParsedLinkHeader = {};

  if (!link) return parsed;

  const items = link.split(',');

  for (const item of items) {
    const [rawUriReference, ...rawLinkParameters] = item.split(';') as [
      string,
      ...string[]
    ];
    const trimmedUriReference = rawUriReference.trim();

    const reference = trimmedUriReference.slice(1, -1);
    const parameters: TParameters = {};

    for (const rawParameter of rawLinkParameters) {
      const trimmedRawParameter = rawParameter.trim();
      const [key, value] = trimmedRawParameter.split('=');

      parameters[key.trim()] = value.slice(1, -1);
    }

    parsed[parameters.rel as TRel] = {
      uri: reference,
      parameters,
    };
  }

  return parsed;
}
