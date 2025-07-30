import { usePaths } from 'vitepress-openapi';

export default {
  async paths() {
    const OPENAPI_JSON_URL =
      process.env.VITE_OPENAPI_JSON_URL ||
      'http://localhost:3000/api/openapi.json';

    const openapiSpec = await (await fetch(OPENAPI_JSON_URL)).json();

    return usePaths({ spec: openapiSpec })
      .getPathsByVerbs()
      .map(({ operationId, summary }) => {
        return {
          params: {
            operationId,
          },
        };
      });
  },
};
