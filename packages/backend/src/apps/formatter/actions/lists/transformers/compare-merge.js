const compareMerge = ($) => {
  const list1 = JSON.parse($.step.parameters.list1); // First list of employees (e.g., Xero)
  const list2 = JSON.parse($.step.parameters.list2); // Second list of employees (e.g., Clockify)
  const field1 = $.step.parameters.field1.toLowerCase(); // Field to match in list1
  const field2 = $.step.parameters.field2.toLowerCase(); // Field to match in list2
  const merge1 = $.step.parameters.merge1.toLowerCase().split(","); // Fields from List1 to add to curated list on matching entry
  const merge2 = $.step.parameters.merge2.toLowerCase().split(","); // Fields from List2 to add to curated list on matching entry
  const prefix1 = $.step.parameters.prefix1 || ""; // Optional prefix for list1 fields
  const prefix2 = $.step.parameters.prefix2 || ""; // Optional prefix for list2 fields
  const includeMatchField = $.step.parameters.includeMatchField || ""; // String to specify the label for the matching field (e.g., "key", "email")

  // Handle edge cases for "NONE" and "ALL"
  if (merge1.includes("none")) {
    merge1.length = 0; // If "NONE", exclude all fields from merge1 (list1)
  }
  if (merge2.includes("none")) {
    merge2.length = 0; // If "NONE", exclude all fields from merge2 (list2)
  }
  if (merge1.includes("all")) {
    merge1.length = 0; // Clear existing fields in merge1 if "ALL" is specified
    Object.keys(list1[0]).forEach(key => merge1.push(key.toLowerCase())); // Add all fields from list1
  }
  if (merge2.includes("all")) {
    merge2.length = 0; // Clear existing fields in merge2 if "ALL" is specified
    Object.keys(list2[0]).forEach(key => merge2.push(key.toLowerCase())); // Add all fields from list2
  }

  // Create a new array to hold the updated items
  const updatedList = list1.map(list1Item => {
    // Find the key in list1 and list2 that matches the lowercase field name
    const key1 = Object.keys(list1Item).find(key => key.toLowerCase() === field1);
    const key2 = Object.keys(list2[0]).find(key => key.toLowerCase() === field2); // Assuming all items in list2 have the same structure

    if (key1 && key2) {
      // Check if there's a matching item in list2
      const matchingItem = list2.find(list2Item => {
        return String(list2Item[key2]).toLowerCase() === String(list1Item[key1]).toLowerCase();
      });

      // If a match is found, append the specified fields from list1 and list2 into list1Item
      if (matchingItem) {
        // Create a new object to store the merged result
        const mergedItem = {};

        // Include the matching field if includeMatchField is populated
        if (includeMatchField) {
          mergedItem[includeMatchField] = list1Item[key1]; // Add the matched field with the user-defined key
        }

        // Merge fields from list1 (merge1)
        merge1.forEach(field => {
          const fieldKey = Object.keys(list1Item).find(key => key.toLowerCase() === field);
          if (fieldKey) {
            // Add prefix for fields from list1
            const prefixedField = prefix1 ? `${prefix1}-${fieldKey}` : fieldKey;
            mergedItem[prefixedField] = list1Item[fieldKey]; // Add the field from list1 to mergedItem
          }
        });

        // Merge fields from list2 (merge2)
        merge2.forEach(field => {
          const fieldKey = Object.keys(matchingItem).find(key => key.toLowerCase() === field);
          if (fieldKey) {
            // Add prefix for fields from list2
            const prefixedField = prefix2 ? `${prefix2}-${fieldKey}` : fieldKey;
            mergedItem[prefixedField] = matchingItem[fieldKey]; // Append the matching field from list2 to mergedItem
          }
        });

        return mergedItem; // Return the merged item
      }
    }

    // If no match, return null to exclude this item from the result
    return null;
  }).filter(item => item !== null); // Filter out any null values (no matches)

  return updatedList;
};

export default compareMerge;