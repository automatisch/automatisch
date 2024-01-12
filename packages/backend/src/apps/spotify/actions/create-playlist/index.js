import defineAction from '../../../../helpers/define-action.js';

export default defineAction({
  name: 'Create playlist',
  key: 'createPlaylist',
  description: `Create playlist on user's account.`,
  arguments: [
    {
      label: 'Playlist name',
      key: 'playlistName',
      type: 'string',
      required: true,
      description: 'Playlist name',
      variables: true,
    },
    {
      label: 'Playlist visibility',
      key: 'playlistVisibility',
      type: 'dropdown',
      required: true,
      description: 'Playlist visibility',
      variables: true,
      options: [
        { label: 'public', value: 'Public' },
        { label: 'private', value: 'Private' },
      ],
    },
    {
      label: 'Playlist description',
      key: 'playlistDescription',
      type: 'string',
      required: false,
      description: 'Playlist description',
      variables: true,
    },
  ],

  async run($) {
    const playlistName = $.step.parameters.playlistName;
    const playlistDescription = $.step.parameters.playlistDescription;
    const playlistVisibility =
      $.step.parameters.playlistVisibility === 'public' ? true : false;

    const response = await $.http.post(
      `v1/users/${$.auth.data.userId}/playlists`,
      {
        name: playlistName,
        public: playlistVisibility,
        description: playlistDescription,
      }
    );

    $.setActionItem({ raw: response.data });
  },
});
