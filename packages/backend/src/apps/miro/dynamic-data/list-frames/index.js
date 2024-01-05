export default {
  name: 'List frames',
  key: 'listFrames',

  async run($) {
    const frames = {
      data: [],
    };

    const boardId = $.step.parameters.boardId;

    if (!boardId) {
      return { data: [] };
    }

    let next;
    do {
      const {
        data: { data, links },
      } = await $.http.get(`/v2/boards/${boardId}/items`);

      next = links?.next;

      const allFrames = data.filter((item) => item.type === 'frame');

      if (allFrames.length) {
        for (const frame of allFrames) {
          frames.data.push({
            value: frame.id,
            name: frame.data.title,
          });
        }
      }
    } while (next);

    return frames;
  },
};
