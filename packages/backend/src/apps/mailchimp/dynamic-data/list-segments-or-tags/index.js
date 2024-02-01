export default {
  name: 'List segments or tags',
  key: 'listSegmentsOrTags',

  async run($) {
    const segmentsOrTags = {
      data: [],
    };
    const audienceId = $.step.parameters.audienceId;

    if (!audienceId) {
      return segmentsOrTags;
    }

    const {
      data: { tags: allTags },
    } = await $.http.get(`/3.0/lists/${audienceId}/tag-search`);

    const {
      data: { segments },
    } = await $.http.get(`/3.0/lists/${audienceId}/segments`);

    const mergedArray = [...allTags, ...segments].reduce(
      (accumulator, current) => {
        if (!accumulator.some((item) => item.id === current.id)) {
          accumulator.push(current);
        }
        return accumulator;
      },
      []
    );

    if (mergedArray?.length) {
      for (const tagOrSegment of mergedArray) {
        segmentsOrTags.data.push({
          value: tagOrSegment.id,
          name: tagOrSegment.name,
        });
      }
    }

    return segmentsOrTags;
  },
};
