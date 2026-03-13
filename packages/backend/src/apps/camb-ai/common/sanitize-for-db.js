// Strips \u0000 null bytes from data before storing in Postgres JSONB.
// Postgres JSONB does not support \u0000 and will throw
// "unsupported Unicode escape sequence" if present.
const sanitizeForDb = (data) => {
  if (data === null || data === undefined) return data;
  return JSON.parse(JSON.stringify(data).replace(/\\u0000/g, ''));
};

export default sanitizeForDb;
