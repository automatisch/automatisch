import { IGlobalVariable } from '@automatisch/types';
import { XMLParser } from 'fast-xml-parser';

const newItemsInFeed = async ($: IGlobalVariable) => {
  const { data } = await $.http.get($.step.parameters.feedUrl as string);
  const parser = new XMLParser();
  const parsedData = parser.parse(data);

  for (const item of parsedData.rss.channel.item) {
    const dataItem = {
      raw: item,
      meta: {
        internalId: item.guid,
      },
    };

    $.pushTriggerItem(dataItem);
  }
};

export default newItemsInFeed;
