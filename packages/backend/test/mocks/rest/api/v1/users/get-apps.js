const getAppsMock = () => {
  const appsData = [
    {
      authDocUrl: 'https://automatisch.io/docs/apps/deepl/connection',
      connectionCount: 1,
      flowCount: 1,
      iconUrl: 'http://localhost:3000/apps/deepl/assets/favicon.svg',
      key: 'deepl',
      name: 'DeepL',
      primaryColor: '0d2d45',
      supportsConnections: true,
    },
    {
      authDocUrl: 'https://automatisch.io/docs/apps/github/connection',
      connectionCount: 1,
      flowCount: 1,
      iconUrl: 'http://localhost:3000/apps/github/assets/favicon.svg',
      key: 'github',
      name: 'GitHub',
      primaryColor: '000000',
      supportsConnections: true,
    },
    {
      authDocUrl: 'https://automatisch.io/docs/apps/slack/connection',
      flowCount: 1,
      iconUrl: 'http://localhost:3000/apps/slack/assets/favicon.svg',
      key: 'slack',
      name: 'Slack',
      primaryColor: '4a154b',
      supportsConnections: true,
    },
    {
      authDocUrl: 'https://automatisch.io/docs/apps/webhook/connection',
      flowCount: 1,
      iconUrl: 'http://localhost:3000/apps/webhook/assets/favicon.svg',
      key: 'webhook',
      name: 'Webhook',
      primaryColor: '0059F7',
      supportsConnections: false,
    },
  ];

  return {
    data: appsData,
    meta: {
      count: appsData.length,
      currentPage: null,
      isArray: true,
      totalPages: null,
      type: 'Object',
    },
  };
};

export default getAppsMock;
