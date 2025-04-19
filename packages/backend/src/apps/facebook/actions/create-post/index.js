import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create Post',
  key: 'createPost',
  description: 'Create a new post on a Facebook page.',
  arguments: [
    {
      label: 'Page',
      key: 'pageId',
      type: 'dropdown',
      required: true,
      description: 'The Facebook page to post to.',
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
    {
      label: 'Message',
      key: 'message',
      type: 'string',
      required: true,
      description: 'The text content of the post.',
      variables: true,
    },
    {
      label: 'Link (Optional)',
      key: 'link',
      type: 'string',
      required: false,
      description: 'A URL to include in the post.',
      variables: true,
    },
    {
      label: 'Published',
      key: 'published',
      type: 'boolean',
      required: false,
      description: 'Whether to publish the post immediately or save as draft.',
      variables: true,
      default: true,
    },
  ],

  async run($) {
    const { pages } = $.auth.data || {};
    const { pageId, message, link, published = true } = $.step.parameters;

    if (!pageId) {
      throw new Error('Page ID is required. Please select a Facebook page.');
    }

    if (!message && !link) {
      throw new Error('Message or link is required for the post.');
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

    // Validate URL if provided
    if (link) {
      try {
        // Check if URL is valid by attempting to create a URL object
        new URL(link);
      } catch (error) {
        throw new Error(
          'Invalid URL format. Please provide a valid URL including the protocol (http:// or https://).'
        );
      }
    }

    // Create the post
    try {
      // Construct parameters as URLSearchParams for proper encoding
      const params = new URLSearchParams();
      params.append('access_token', pageAccessToken);

      if (message) {
        params.append('message', message);
      }

      if (link) {
        params.append('link', link);
      }

      params.append('published', published.toString());

      // Use a different approach - direct fetch call to avoid URL construction issues
      const url = `${$.app.apiBaseUrl}/${pageId}/feed`;

      console.log(`Attempting to post to Facebook: ${url}`);

      // Make the request using native fetch instead of the app's HTTP client
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Facebook API error response:', errorData);
        throw new Error(
          `Facebook API error: ${errorData?.error?.message || 'Unknown error'}`
        );
      }

      const responseData = await response.json();

      return {
        data: responseData,
        success: true,
        postId: responseData.id,
      };
    } catch (error) {
      console.error(
        'Error creating Facebook post:',
        error.response?.data || error
      );

      // Provide more descriptive error messages based on common issues
      if (error.response?.data?.error) {
        const fbError = error.response.data.error;

        if (fbError.code === 190) {
          throw new Error(
            'Invalid access token. Please reconnect your Facebook account.'
          );
        } else if (fbError.code === 200) {
          throw new Error(
            'Permission error. Make sure your app has the necessary permissions: pages_manage_posts and pages_read_engagement.'
          );
        } else if (fbError.code === 100) {
          throw new Error(`Facebook API error: ${fbError.message}`);
        }
      }

      throw new Error(
        `Failed to create post: ${error.message || 'Unknown error'}`
      );
    }
  },
});
