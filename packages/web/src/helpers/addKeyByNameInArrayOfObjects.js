import slugify from 'slugify';

export default function addKeyByNameInArrayOfObjects(items) {
  return items.map((item) => ({
    ...item,
    key: slugify(item.name, { lower: true, strict: true, replacement: '-' }),
  }));
}
