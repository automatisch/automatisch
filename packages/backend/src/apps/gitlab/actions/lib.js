/**
 * Cleanups the fields that does not have any value set on them.
 *
 * @param {Map<string, string>} fields
 * @return {Map<string, string>} Cleaned fields
 */
export function cleanOptionalFields(fields) {
  const cleanedFields = {};
  for (const key in fields) {
    if (
      fields[key] === '' ||
      fields[key] === undefined ||
      fields[key] === null
    ) {
      continue;
    }
    cleanedFields[key] = fields[key];
  }

  return cleanedFields;
}
