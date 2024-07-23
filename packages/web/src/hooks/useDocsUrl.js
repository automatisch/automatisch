import useAutomatischInfo from 'hooks/useAutomatischInfo';

const appendTrailingSlash = (url) => {
  if (!url) {
    return undefined;
  }

  if (!url.endsWith('/')) {
    return `${url}/`;
  }

  return url;
}

/**
 * Per instance, there may be different documentation. However, the paths are assumed the same.
 * The given DOCS_URL is made sure to have a trailing slash to have relative paths work as expected.
 */
export default function useDocsUrl(path) {
  const { data: automatischInfo } = useAutomatischInfo();
  const docsUrlWithTrailingSlash = appendTrailingSlash(automatischInfo?.docsUrl);
  const docsUrl = docsUrlWithTrailingSlash || 'https://automatisch.io/docs/';

  const absoluteUrl = new URL(path, docsUrl).toString();

  return absoluteUrl;
}
