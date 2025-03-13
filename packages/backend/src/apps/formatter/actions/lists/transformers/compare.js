const compare = ($) => {
  const list1 = JSON.parse($.step.parameters.list1);
  const list2 = JSON.parse($.step.parameters.list2);
  const field1 = $.step.parameters.field1.toLowerCase();
  const field2 = $.step.parameters.field2.toLowerCase();
  
  // Filter list1 to include only entries where the specified field in list1 matches the specified field in list2
  const curatedList = list1.filter(list1Item => 
    list2.some(list2Item => {
      // Find the key in list1 and list2 that matches the lowercase field name
      const key1 = Object.keys(list1Item).find(key => key.toLowerCase() === field1);
      const key2 = Object.keys(list2Item).find(key => key.toLowerCase() === field2);

      // If keys are found, compare their values case-insensitively
      if (key1 && key2) {
        return String(list2Item[key2]).toLowerCase() === String(list1Item[key1]).toLowerCase();
      }
      
      // If keys are not found, return false
      return false;
    })
  );
  return curatedList;
};

export default compare;
