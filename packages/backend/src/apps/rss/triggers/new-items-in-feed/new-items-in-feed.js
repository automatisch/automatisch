import { XMLParser } from 'fast-xml-parser';
import bcrypt from 'bcrypt';

const getInternalId = async (item) => {
  if (item.guid) {
    return typeof item.guid === 'object'
      ? item.guid['#text'].toString()
      : item.guid.toString();
  } else if (item.id) {
    return typeof item.id === 'object'
      ? item.id['#text'].toString()
      : item.id.toString();
  }

  return await hashItem(JSON.stringify(item));
};

const hashItem = async (value) => {
  return await bcrypt.hash(value, 1);
};

const newItemsInFeed = async ($) => {
  const { data } = await $.http.get($.step.parameters.feedUrl);
  const parser = new XMLParser({
    ignoreAttributes: false,
  });
  const parsedData = parser.parse(data);

  // naive implementation to cover atom and rss feeds
  const items = parsedData.rss?.channel?.item || parsedData.feed?.entry || [];

  for (const item of items) {
    const dataItem = {
      raw: item,
      meta: {
        internalId: await getInternalId(item),
      },
    };

    $.pushTriggerItem(dataItem);
  }
};

export default newItemsInFeed;
