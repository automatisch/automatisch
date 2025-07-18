import slugify from 'slugify';

export default function addKeyByNameInArrayOfObjects(items) {
  return items.map((item) => {
    const processedItem = {
      ...item,
      key:
        item.key ||
        slugify(item.name, { lower: true, strict: true, replacement: '-' }),
    };

    // If this is an array field with nested fields, process them recursively
    if (item.type === 'array' && item.fields && Array.isArray(item.fields)) {
      processedItem.fields = addKeyByNameInArrayOfObjects(item.fields);
    }

    return processedItem;
  });
}
