export default function objectifyUrlSearchParams(searchParams) {
  return Array.from(searchParams.entries()).reduce((acc, [key, value]) => {
    return { ...acc, [key]: value };
  }, {});
}
