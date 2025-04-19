import defineTrigger from '../../../../helpers/define-trigger.js';

export default defineTrigger({
  name: 'New Page Post',
  key: 'newPagePost',
  description:
    'Triggers when a new post is published on a selected Facebook page.',
  pollInterval: 15 * 60 * 1000, // Poll every 15 minutes
  arguments: [
    {
      label: 'Page',
      key: 'pageId',
      type: 'dropdown',
      required: true,
      description: 'The Facebook page to monitor for new posts.',
      variables: false,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listPages',
          },
        ],
      },
    },
  ],

  async run($) {
    const { pages } = $.auth.data || {};
    // Safely extract pageId from parameters, with fallback for backward compatibility
    const pageId =
      $.step?.parameters?.pageId || ($.propsValue && $.propsValue.pageId);

    if (!pageId) {
      throw new Error('Page ID is required. Please select a Facebook page.');
    }

    // Find the selected page and its access token
    let pageAccessToken;

    // First check if we already have the page token from auth
    if (pages && Array.isArray(pages)) {
      const selectedPage = pages.find((page) => page.id === pageId);
      if (selectedPage && selectedPage.access_token) {
        pageAccessToken = selectedPage.access_token;
      }
    }

    // If no page token found in auth, fetch it
    if (!pageAccessToken) {
      const pagesResponse = await $.http.get('/me/accounts');

      const selectedPage = pagesResponse.data.data.find(
        (page) => page.id === pageId
      );
      if (!selectedPage) {
        throw new Error(`Page with ID ${pageId} not found.`);
      }
      pageAccessToken = selectedPage.access_token;
    }

    if (!pageAccessToken) {
      throw new Error('Could not retrieve page access token.');
    }

    // Get latest posts
    const response = await $.http.get(`/${pageId}/posts`, {
      params: {
        access_token: pageAccessToken,
        fields: 'id,message,created_time,permalink_url,attachments',
        limit: 10,
      },
    });

    const posts = response.data.data;

    return {
      data: posts.map((post) => ({
        raw: post,
        meta: {
          id: post.id,
          created_time: post.created_time,
        },
      })),
    };
  },

  async testRun($) {
    const { pages } = $.auth.data || {};
    // Safely extract pageId from parameters, with fallback for backward compatibility
    const pageId =
      $.step?.parameters?.pageId || ($.propsValue && $.propsValue.pageId);

    if (!pageId) {
      throw new Error('Page ID is required. Please select a Facebook page.');
    }

    // Find the selected page and its access token
    let pageAccessToken;

    // First check if we already have the page token from auth
    if (pages && Array.isArray(pages)) {
      const selectedPage = pages.find((page) => page.id === pageId);
      if (selectedPage && selectedPage.access_token) {
        pageAccessToken = selectedPage.access_token;
      }
    }

    // If no page token found in auth, fetch it
    if (!pageAccessToken) {
      const pagesResponse = await $.http.get('/me/accounts');

      const selectedPage = pagesResponse.data.data.find(
        (page) => page.id === pageId
      );
      if (!selectedPage) {
        throw new Error(`Page with ID ${pageId} not found.`);
      }
      pageAccessToken = selectedPage.access_token;
    }

    if (!pageAccessToken) {
      throw new Error('Could not retrieve page access token.');
    }

    // Get latest post
    const response = await $.http.get(`/${pageId}/posts`, {
      params: {
        access_token: pageAccessToken,
        fields: 'id,message,created_time,permalink_url,attachments',
        limit: 1,
      },
    });

    if (response.data.data.length === 0) {
      throw new Error('No posts found on this page.');
    }

    const post = response.data.data[0];

    return {
      data: {
        raw: post,
        meta: {
          id: post.id,
          created_time: post.created_time,
        },
      },
    };
  },
});
