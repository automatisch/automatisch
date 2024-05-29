import defineAction from '../../../../helpers/define-action.js';
import isEmpty from 'lodash/isEmpty.js';
import omitBy from 'lodash/omitBy.js';

export default defineAction({
  name: 'Update post',
  key: 'updatePost',
  description: 'Updates a post.',
  arguments: [
    {
      label: 'Post',
      key: 'postId',
      type: 'dropdown',
      required: false,
      description: 'Choose a post to update.',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listPosts',
          },
        ],
      },
    },
    {
      label: 'Title',
      key: 'title',
      type: 'string',
      required: true,
      description: '',
      variables: true,
    },
    {
      label: 'Content',
      key: 'content',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Excerpt',
      key: 'excerpt',
      type: 'string',
      required: false,
      description: '',
      variables: true,
    },
    {
      label: 'Password',
      key: 'password',
      type: 'string',
      required: false,
      description: 'A password to protect access to the content and excerpt.',
      variables: true,
    },
    {
      label: 'Author',
      key: 'author',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listUsers',
          },
        ],
      },
    },
    {
      label: 'Featured Media',
      key: 'featuredMedia',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listMedia',
          },
        ],
      },
    },
    {
      label: 'Comment Status',
      key: 'commentStatus',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      label: 'Ping Status',
      key: 'pingStatus',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
      ],
    },
    {
      label: 'Format',
      key: 'format',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Aside', value: 'aside' },
        { label: 'Chat', value: 'chat' },
        { label: 'Gallery', value: 'gallery' },
        { label: 'Link', value: 'link' },
        { label: 'Image', value: 'image' },
        { label: 'Quote', value: 'quote' },
        { label: 'Status', value: 'status' },
        { label: 'Status', value: 'status' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
      ],
    },
    {
      label: 'Sticky',
      key: 'sticky',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      options: [
        { label: 'False', value: 'false' },
        { label: 'True', value: 'true' },
      ],
    },
    {
      label: 'Categories',
      key: 'categoryIds',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Category',
          key: 'categoryId',
          type: 'dropdown',
          required: false,
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listCategories',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'Tags',
      key: 'tagIds',
      type: 'dynamic',
      required: false,
      description: '',
      fields: [
        {
          label: 'Tag',
          key: 'tagId',
          type: 'dropdown',
          required: false,
          variables: true,
          source: {
            type: 'query',
            name: 'getDynamicData',
            arguments: [
              {
                name: 'key',
                value: 'listTags',
              },
            ],
          },
        },
      ],
    },
    {
      label: 'Status',
      key: 'status',
      type: 'dropdown',
      required: false,
      description: '',
      variables: true,
      source: {
        type: 'query',
        name: 'getDynamicData',
        arguments: [
          {
            name: 'key',
            value: 'listStatuses',
          },
        ],
      },
    },
    {
      label: 'Date',
      key: 'date',
      type: 'string',
      required: false,
      description: "Post publish date in the site's timezone",
      variables: true,
    },
  ],

  async run($) {
    const {
      postId,
      title,
      content,
      excerpt,
      password,
      author,
      featuredMedia,
      commentStatus,
      pingStatus,
      format,
      sticky,
      categoryIds,
      tagIds,
      status,
      date,
    } = $.step.parameters;

    const allCategoryIds = categoryIds
      ?.map((categoryId) => categoryId.categoryId)
      .filter(Boolean);

    const allTagIds = tagIds?.map((tagId) => tagId.tagId).filter(Boolean);

    let body = {
      title,
      content,
      excerpt,
      password,
      author,
      featured_media: featuredMedia,
      comment_status: commentStatus,
      ping_status: pingStatus,
      format,
      sticky,
      categories: allCategoryIds,
      tags: allTagIds,
      status,
      date,
    };

    body = omitBy(body, isEmpty);

    const response = await $.http.post(
      `?rest_route=/wp/v2/posts/${postId}`,
      body
    );

    $.setActionItem({ raw: response.data });
  },
});
